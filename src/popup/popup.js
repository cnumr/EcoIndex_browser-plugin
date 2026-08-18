import {
	FETCH_ID_TASK_URL,
	FETCH_RESULT_ECOINDEX_URL,
	FETCH_RESULT_URL,
	FETCH_SCREENSHOT_URL,
	FETCH_TASK_URL,
	getBrowserPolyfill,
} from "../common.js";

let tabUrl;
/** @type {{ showScreenshot: boolean }} */
let options = { showScreenshot: true };
const domTitle = document.getElementById("title");
const currentBrowser = getBrowserPolyfill();
const badgeIntegrationElement = document.getElementById("badge-integration");
const badgeSnippetElement = document.getElementById("badge-snippet");
const badgeThemeElement = document.getElementById("badge-theme");
const badgePreviewLinkElement = document.getElementById("badge-preview-link");
const badgePreviewImgElement = document.getElementById("badge-preview-img");
let shouldRefreshBadgePreview = false;

const ANALYSIS_ERROR_DEFAULT = "Veuillez réessayer plus tard";
const ANALYSIS_ERROR_403_EXCLUDED =
	"Ce nom de domaine est exclu des analyses EcoIndex.";
const ANALYSIS_ERROR_MESSAGES = {
	400: "Cette URL est injoignable. Vérifiez l’adresse saisie (faute de frappe, site hors ligne, nom de domaine inexistant…) puis réessayez.",
	401: "Cette page nécessite une authentification. EcoIndex ne peut analyser que des pages accessibles publiquement.",
	403: "L’accès à cette page a été refusé. Le site bloque probablement l’analyse (protection antibot, accès interdit). Vous pouvez réessayer plus tard, ou tester une autre page.",
	404: "Analyse introuvable.",
	422: "Un paramètre n’est pas valide, pouvez-vous vérifier votre requête ?",
	429: "Vous avez atteint la limite de ##daily_limit_per_host## appels par jour pour le nom de domaine ##host##.",
	500: "Une erreur inattendue s’est produite pendant l’analyse. Le problème est généralement temporaire : veuillez réessayer dans quelques instants.",
	502: "L’url demandée n’est pas valide. Veuillez vérifier l’URL et réessayer.",
	504: "La page web indiquée ne semble pas répondre. Pouvez vous réessayer plus tard ?",
	520: "Cette ressource n’est pas une page HTML (fichier PDF, image, JSON, etc.). EcoIndex ne peut analyser que des pages web au format HTML.",
	521: "La page n’a pas pu être analysée car le serveur n’a pas renvoyé un code HTTP 200. Elle est peut-être introuvable, protégée, en redirection ou temporairement en erreur.",
};

function isScalar(value) {
	return (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	);
}

function flattenDetails(details) {
	if (details == null || typeof details !== "object") {
		return {};
	}

	const interpolations = {};
	for (const [key, value] of Object.entries(details)) {
		if (value != null && typeof value === "object" && !Array.isArray(value)) {
			for (const [nestedKey, nestedValue] of Object.entries(value)) {
				if (isScalar(nestedValue)) {
					interpolations[nestedKey] = String(nestedValue);
				}
			}
		} else if (isScalar(value)) {
			interpolations[key] = String(value);
		}
	}
	return interpolations;
}

function isExcludedHost(details) {
	const text =
		typeof details === "string"
			? details
			: (details?.detail ?? details?.message ?? "");
	return String(text).toLowerCase().includes("excluded");
}

function stringifyErrorDetail(detail) {
	if (detail == null || detail === "") {
		return "";
	}
	if (typeof detail === "string") {
		return detail;
	}
	try {
		return JSON.stringify(detail, null, 2);
	} catch {
		return String(detail);
	}
}

/**
 * User-facing analysis error message from an API status code.
 * @param {number|string|undefined} errorCode
 * @param {unknown} details
 * @returns {string}
 */
function getAnalysisErrorMessage(errorCode, details) {
	const code = Number(errorCode);
	let message =
		code === 403 && isExcludedHost(details)
			? ANALYSIS_ERROR_403_EXCLUDED
			: ANALYSIS_ERROR_MESSAGES[code] || ANALYSIS_ERROR_DEFAULT;

	for (const [key, value] of Object.entries(flattenDetails(details))) {
		message = message.replaceAll(`##${key}##`, value);
	}

	return message;
}

async function loadOptions() {
	const stored = await currentBrowser.storage.local.get({
		ecoindex_options: { showScreenshot: true },
	});
	options = { ...stored.ecoindex_options };
}

/**
 * display error message
 * @param string title
 * @param any detail
 */
function displayError(title, detail) {
	document.getElementById("loader").style.display = "none";
	const errorTitle = document.querySelector("#error summary");
	const errorDetail = document.querySelector("#error code");
	errorDetail.textContent = detail;
	errorTitle.textContent = title;
	document.getElementById("error").style.display = "block";
}

/**
 * Display error message if an error occurs while fetching data
 * @param Error error
 */
function handleApiError(error) {
	console.error(error);
	displayError(
		"Une erreur est survenue en essayant de récupérer les données de l'API",
		error.message,
	);
}

/**
 * Propose to analyze the current page if no analysis is available
 * @param string message
 */
function proposeAnalysis(message) {
	const noAnalyzis = document.getElementById("no-analysis");
	domTitle.textContent = message;
	noAnalyzis.style.display = "block";
	domTitle.style.display = "block";
}

/**
 * Helper to display date in french
 * @param Date date
 * @returns string
 */
function convertDate(date) {
	return new Date(date).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	});
}

/**
 * Display the image of the analysis if exists
 * @param string id
 */
function displayImage(id) {
	fetch(FETCH_SCREENSHOT_URL(id))
		.then((response) => {
			if (response.status !== 200) {
				throw new Error(`Pas de screenshot pour l'analyse ${id}`);
			}
			return response.blob();
		})
		.then((imageBlob) => {
			const screenshot = document.getElementById("screenshot");
			screenshot.setAttribute("src", URL.createObjectURL(imageBlob));
			screenshot.style.display = "block";
		})
		.catch((error) => console.error(error));
}

/**
 * Reset list element
 * @param Element section
 */
function resetList(section) {
	const ul = section.getElementsByTagName("ul")[0];
	ul.innerHTML = "";
}

/**
 * Display list element for other results
 * @param Element section
 * @param any ecoindex
 */
function makeList(section, ecoindex) {
	const b = document.createElement("button");
	b.style.backgroundColor = ecoindex.color;
	b.style.color = "#FFF";
	b.style.padding = "10px";
	b.textContent = ecoindex.grade;

	const resultLink = document.createElement("a");
	resultLink.appendChild(b);
	resultLink.setAttribute("href", FETCH_RESULT_ECOINDEX_URL(ecoindex.id));
	resultLink.setAttribute("target", "_blank");

	const li = document.createElement("li");
	li.classList.add("result-item");
	li.setAttribute(
		"title",
		`(${ecoindex.score} / 100) le ${convertDate(ecoindex.date)}`,
	);
	li.appendChild(resultLink);

	const pageLink = document.createElement("a");
	pageLink.textContent = ecoindex.url;
	pageLink.setAttribute("href", ecoindex.url);
	pageLink.setAttribute("target", "_blank");
	pageLink.classList.add("result-item-link");

	const pageLinkDate = document.createElement("span");
	pageLinkDate.textContent = `(${convertDate(ecoindex.date)})`;
	pageLinkDate.classList.add("result-item-date");

	const itemTextWrapper = document.createElement("div");
	itemTextWrapper.classList.add("result-item-text");
	itemTextWrapper.appendChild(pageLink);
	itemTextWrapper.appendChild(pageLinkDate);
	li.appendChild(itemTextWrapper);

	const ul = section.getElementsByTagName("ul")[0];
	ul.appendChild(li);
}

/**
 * Display other results
 * @param any ecoindexData
 * @param string tag
 * @returns null
 */
function setOtherResults(ecoindexData, tag) {
	const section = document.getElementById(`${tag}-results`);
	const data = ecoindexData[`${tag}-results`];

	if ((data?.length || 0) === 0) {
		return;
	}

	resetList(section);

	data.slice(-5).forEach((ecoindex) => {
		makeList(section, ecoindex);
	});

	section.style.display = "block";
}

/**
 * Display the result of the analysis using data from the API
 * @param any ecoindexData results from the BFF API
 */
function displayResult(ecoindexData) {
	const latestResult = ecoindexData["latest-result"];
	if (latestResult.id !== "") {
		const dateResultElement = document.getElementById("result-date");
		dateResultElement.textContent = convertDate(latestResult.date);

		domTitle.textContent = "Résultat pour cette page";
		domTitle.style.display = "block";

		const activeLevelChart = document.querySelector(
			`[data-grade-result="${latestResult.grade}"]`,
		);
		activeLevelChart.classList.add("--active");

		const resultScore = document.getElementById("result-score");
		resultScore.textContent = latestResult.score;

		const resultLink = document.getElementById("result-link");
		resultLink.setAttribute("href", FETCH_RESULT_ECOINDEX_URL(latestResult.id));

		document.getElementById("result").style.display = "block";
		badgeIntegrationElement.style.display = "block";
		updateBadgeSnippet(tabUrl, getBadgeTheme(), shouldRefreshBadgePreview);
		shouldRefreshBadgePreview = false;
		if (options.showScreenshot) {
			displayImage(latestResult.id);
		}
	}

	if (
		ecoindexData["older-results"]?.length > 0 ||
		ecoindexData["host-results"]?.length > 0
	) {
		document.getElementById("other-results").style.display = "block";
		setOtherResults(ecoindexData, "older");
		setOtherResults(ecoindexData, "host");
	}
}

/**
 * Update the popup with data from the API
 * @param any ecoindexData
 */
function updatePopup(ecoindexData) {
	if (
		ecoindexData.count === 0 &&
		(ecoindexData["older-results"]?.length || 0) === 0
	) {
		proposeAnalysis("Aucune analyse pour ce site");
	} else if (ecoindexData["latest-result"].id === "") {
		proposeAnalysis("Aucune analyse pour cette page");
	}

	displayResult(ecoindexData);
}

/**
 * Build and display a reusable Ecoindex badge snippet for the current URL.
 * @param {string} url
 * @param {"light" | "dark"} theme
 * @param {boolean} refreshPreview
 */
function updateBadgeSnippet(url, theme = "light", refreshPreview = false) {
	const redirectUrl = `https://bff.ecoindex.fr/redirect/?url=${url}`;
	const badgeUrl = `https://bff.ecoindex.fr/badge/?theme=${theme}&url=${url}`;
	const previewUrl = refreshPreview
		? `${badgeUrl}&refresh=true&_ts=${Date.now()}`
		: badgeUrl;
	badgeSnippetElement.textContent = `<a href="${redirectUrl}" target="_blank">
    <img src="${badgeUrl}" alt="Ecoindex Badge" />
</a>`;
	badgePreviewLinkElement.setAttribute("href", redirectUrl);
	badgePreviewImgElement.setAttribute("src", previewUrl);
}

function getBadgeTheme() {
	return badgeThemeElement.value === "dark" ? "dark" : "light";
}

/**
 * Get data from the API and update the popup
 * @param string url
 */
function getAndUpdateEcoindexData(url) {
	fetch(FETCH_RESULT_URL(url, true))
		.then((r) => r.json())
		.then(updatePopup)
		.catch(handleApiError);
}

const fetchWithRetries = async (url, options, retryCount = 0) => {
	const { maxRetries = 30, ...remainingOptions } = options;
	try {
		const response = await fetch(url, remainingOptions);
		const taskResult = await response.json().catch(() => null);

		if (retryCount < maxRetries && response.status === 425) {
			updateQueueStatus(taskResult);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return fetchWithRetries(url, options, retryCount + 1);
		}

		if (!response.ok) {
			displayError(
				getAnalysisErrorMessage(
					response.status,
					taskResult?.detail ?? taskResult,
				),
				stringifyErrorDetail(taskResult?.detail ?? taskResult),
			);
			return;
		}

		return taskResult;
	} catch (err) {
		if (retryCount < maxRetries && err.status === 425) {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return fetchWithRetries(url, options, retryCount + 1);
		}

		displayError(
			getAnalysisErrorMessage(err.status, err),
			stringifyErrorDetail(err?.message ?? err),
		);
	}
};

/**
 * Display queue position while an analysis task is still pending
 * @param {{ queue_position?: number | null, tasks_in_progress?: number }} task
 */
function updateQueueStatus(task = {}) {
	const el = document.getElementById("queue-status");
	if (!el) {
		return;
	}

	const queuePosition = task.queue_position;
	const tasksInProgress = task.tasks_in_progress;
	const parts = [];

	if (queuePosition === 0) {
		parts.push("Vous êtes le prochain dans la file d’attente.");
	} else if (typeof queuePosition === "number") {
		parts.push(
			queuePosition === 1
				? "Il y a 1 analyse avant la vôtre."
				: `Il y a ${queuePosition} analyses avant la vôtre.`,
		);
	} else {
		parts.push("C’est votre tour, l’analyse est en cours.");
	}

	if (typeof tasksInProgress === "number" && tasksInProgress > 0) {
		parts.push(
			tasksInProgress === 1
				? "1 analyse actuellement en cours."
				: `${tasksInProgress} analyses actuellement en cours.`,
		);
	}

	el.textContent = parts.join(" ");
}

/**
 * Reset the display
 * @returns null
 */
function resetDisplay() {
	document.getElementById("loader").style.display = "none";
	document.getElementById("queue-status").textContent = "";
	document.getElementById("title").style.display = "none";
	document.getElementById("no-analysis").style.display = "none";
	document.getElementById("result").style.display = "none";
	document.getElementById("screenshot").style.display = "none";
	document.getElementById("other-results").style.display = "none";
	document.getElementById("older-results").style.display = "none";
	document.getElementById("host-results").style.display = "none";
	document.getElementById("error").style.display = "none";
	badgeIntegrationElement.style.display = "none";
}

/**
 * Call the API to run an analysis
 */
async function runAnalysis() {
	resetDisplay();
	document.getElementById("loader").style.display = "block";
	shouldRefreshBadgePreview = true;

	fetch(FETCH_TASK_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			web_page: {
				width: 1920,
				height: 1080,
				url: tabUrl,
			},
			include_requests_detail: true,
		}),
	})
		.then(async (response) => {
			const body = await response.json().catch(() => null);
			if (!response.ok) {
				displayError(
					getAnalysisErrorMessage(response.status, body?.detail ?? body),
					stringifyErrorDetail(body?.detail ?? body),
				);
				return;
			}
			return body;
		})
		.then(async (id) => {
			if (id == null) {
				return;
			}

			const taskResult = await fetchWithRetries(FETCH_ID_TASK_URL(id), {
				headers: {
					"Content-Type": "application/json",
				},
				method: "GET",
			});

			if (taskResult === undefined) {
				return;
			}

			const ecoindex = taskResult.ecoindex_result;

			if (taskResult.status === "SUCCESS" && ecoindex?.status === "SUCCESS") {
				document.getElementById("loader").style.display = "none";
				document.getElementById("no-analysis").style.display = "none";

				getAndUpdateEcoindexData(tabUrl);
			}

			if (taskResult.status === "SUCCESS" && ecoindex?.status === "FAILURE") {
				const e = taskResult.ecoindex_result.error;
				displayError(
					getAnalysisErrorMessage(e.status_code, e),
					stringifyErrorDetail(e.detail ?? e.message),
				);
			}

			if (taskResult.status === "FAILURE") {
				displayError(
					getAnalysisErrorMessage(500, taskResult.task_error),
					stringifyErrorDetail(taskResult.task_error),
				);
			}
		})
		.catch(handleApiError);
}

resetDisplay();

loadOptions()
	.then(() => {
		document
			.querySelector("#no-analysis button")
			.addEventListener("click", runAnalysis);
		document.getElementById("retest").addEventListener("click", runAnalysis);
		badgeThemeElement.addEventListener("change", () => {
			updateBadgeSnippet(tabUrl, getBadgeTheme());
		});

		currentBrowser.tabs.query(
			{
				active: true,
				lastFocusedWindow: true,
			},
			(tabs) => {
				tabUrl = tabs[0].url;
				updateBadgeSnippet(tabUrl, getBadgeTheme());

				getAndUpdateEcoindexData(tabUrl);
			},
		);
	})
	.catch(console.error);
