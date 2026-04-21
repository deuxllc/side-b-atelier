const playlistInput = document.querySelector("#playlist-input");
const analyzeButton = document.querySelector("#analyze-button");
const clearButton = document.querySelector("#clear-button");
const fitPill = document.querySelector("#fit-pill");
const trackCountEl = document.querySelector("#track-count");
const totalDurationEl = document.querySelector("#total-duration");
const formatRecommendationEl = document.querySelector("#format-recommendation");
const sideSplitEl = document.querySelector("#side-split");
const moodNameEl = document.querySelector("#mood-name");
const moodDescriptionEl = document.querySelector("#mood-description");
const briefCopyEl = document.querySelector("#brief-copy");
const swatchesEl = document.querySelector("#swatches");
const syncedSummaryEl = document.querySelector("#synced-summary");
const orderForm = document.querySelector("#order-form");
const briefPreviewEl = document.querySelector("#brief-preview");
const copyBriefButton = document.querySelector("#copy-brief");
const copyStatusEl = document.querySelector("#copy-status");
const presetButtons = document.querySelectorAll("[data-preset]");

const presets = {
  night: `The xx — Intro — 02:07
M83 — Midnight City — 04:04
Chromatics — Cherry — 04:17
Kavinsky — Nightcall — 04:17
Desire — Under Your Spell — 03:53
College — A Real Hero — 04:27
The Weeknd — After Hours — 06:01
Frank Ocean — Nights — 05:07
The Midnight — Sunset — 05:28
Rhye — Open — 03:37`,
  soft: `Sade — By Your Side — 04:34
Cigarettes After Sex — Nothing's Gonna Hurt You Baby — 04:46
Rhye — Song For You — 04:21
Mazzy Star — Fade Into You — 04:55
Phoebe Bridgers — Moon Song — 04:38
Clairo — Bags — 04:20
Men I Trust — Show Me How — 03:37
Alvvays — Archie, Marry Me — 03:17
Faye Webster — Kingston — 03:36
Etta James — At Last — 03:00`,
  party: `Dua Lipa — Houdini — 03:06
KAYTRANADA — Lite Spots — 03:20
Jessie Ware — Free Yourself — 03:55
Jamiroquai — Little L — 04:55
Daft Punk — Digital Love — 04:58
Chromeo — Jealous — 03:48
Parcels — Tieduprightnow — 03:08
Purple Disco Machine — Fireworks — 03:24
Roisin Murphy — Murphy's Law — 03:28
Moloko — Sing It Back — 04:38`
};

const moodProfiles = [
  {
    name: "Neon Transit",
    description:
      "Поздний город, фары, мокрый асфальт и ощущение движения. Хорошо ложится в темный бокс с контрастной типографикой и холодным свечением.",
    colors: ["#0f1726", "#235079", "#e25d39"],
    keywords: [
      "night",
      "midnight",
      "city",
      "drive",
      "after",
      "sunset",
      "neon",
      "hero",
      "speed",
      "lights",
      "nights",
      "call"
    ],
    brief:
      "Оформление как кинематографичный ночной маршрут: темная база, один яркий акцент, ощущение скорости и городского света."
  },
  {
    name: "Soft Static",
    description:
      "Интимно, бережно и немного хрупко. Подойдет мягкая бумага, теплые нейтральные оттенки, рукописные фразы и ощущение личного письма.",
    colors: ["#f0dfd1", "#a46f65", "#5f4b48"],
    keywords: [
      "love",
      "moon",
      "baby",
      "fade",
      "side",
      "song",
      "you",
      "open",
      "nothing",
      "hurt",
      "marry",
      "last"
    ],
    brief:
      "Оформление как найденная записка: теплые пудровые тона, аккуратный треклист, ощущение близости и тактильности."
  },
  {
    name: "Golden Haze",
    description:
      "Светлая ностальгия, летняя пыль, фотографии на память. Просится бумажный винтаж, выцветшие оттенки и аккуратные золотистые детали.",
    colors: ["#f5dfb3", "#b7864a", "#435344"],
    keywords: [
      "summer",
      "sun",
      "august",
      "gold",
      "hero",
      "real",
      "days",
      "memory",
      "open",
      "side"
    ],
    brief:
      "Оформление как личный архив лета: винтажная бумага, мягкое зерно, спокойная палитра и эффект времени."
  },
  {
    name: "Stereo Riot",
    description:
      "Грув, танцы, кухня после полуночи и энергия, которая не просит разрешения. Нужны яркие пятна цвета, жирный шрифт и живая подача.",
    colors: ["#ffef9d", "#de5d39", "#244f4c"],
    keywords: [
      "dance",
      "free",
      "fire",
      "digital",
      "party",
      "sing",
      "disco",
      "houdini",
      "jealous",
      "law"
    ],
    brief:
      "Оформление как живая вечеринка на пленке: высокий контраст, теплая энергия, графические акценты и немного хулиганства."
  },
  {
    name: "Still Air",
    description:
      "Медленное, атмосферное и почти медитативное звучание. Здесь лучше работает минимализм, воздух, глубокий зеленый и молочный фон.",
    colors: ["#dce7dd", "#57705d", "#27362e"],
    keywords: [
      "ambient",
      "intro",
      "slow",
      "calm",
      "snow",
      "air",
      "quiet",
      "show",
      "bags",
      "kingston"
    ],
    brief:
      "Оформление как спокойное пространство: много воздуха, глубокая тихая палитра, минимум шума и очень чистая композиция."
  }
];

let labState = {
  tracks: [],
  totalSeconds: 0,
  mood: null,
  format: "—",
  split: "—",
  estimateUsed: false
};

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function toSeconds(durationText) {
  const parts = durationText.split(":").map((value) => Number.parseInt(value, 10));
  if (parts.some(Number.isNaN)) {
    return null;
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return null;
}

function parseLine(line) {
  const durationMatch = line.match(/(\d{1,2}:\d{2}(?::\d{2})?)\s*$/);
  const duration = durationMatch ? toSeconds(durationMatch[1]) : null;
  const rawTitle = durationMatch ? line.slice(0, durationMatch.index).trim() : line.trim();
  const title = rawTitle.replace(/\s+[—-]\s+$/, "").trim();

  return {
    title: title || line.trim(),
    duration: duration ?? 210,
    estimated: duration === null
  };
}

function splitSides(tracks, totalSeconds) {
  if (!tracks.length) {
    return "—";
  }

  const target = totalSeconds / 2;
  let sideASeconds = 0;
  let sideATracks = 0;

  for (const track of tracks) {
    if (sideATracks > 0 && sideASeconds + track.duration > target) {
      break;
    }
    sideASeconds += track.duration;
    sideATracks += 1;
  }

  if (sideATracks === 0) {
    sideATracks = Math.ceil(tracks.length / 2);
    sideASeconds = tracks.slice(0, sideATracks).reduce((sum, track) => sum + track.duration, 0);
  }

  const sideBSeconds = totalSeconds - sideASeconds;
  return `A ${formatDuration(sideASeconds)} / B ${formatDuration(sideBSeconds)}`;
}

function detectFormat(totalSeconds) {
  const minutes = totalSeconds / 60;

  if (minutes <= 60) {
    return "C60";
  }

  if (minutes <= 90) {
    return "C90";
  }

  if (minutes <= 120) {
    return "двойной сет";
  }

  return "нужна кураторская сборка";
}

function detectFitStatus(totalSeconds) {
  const minutes = totalSeconds / 60;

  if (minutes === 0) {
    return "жду ваш плейлист";
  }

  if (minutes <= 60) {
    return "влезает мягко";
  }

  if (minutes <= 90) {
    return "идеально для C90";
  }

  if (minutes <= 120) {
    return "лучше разбить на 2 кассеты";
  }

  return "слишком длинно — нужно сократить";
}

function chooseMood(tracks) {
  const corpus = tracks.map((track) => track.title.toLowerCase()).join(" ");
  let bestProfile = moodProfiles[0];
  let bestScore = -1;

  for (const profile of moodProfiles) {
    const score = profile.keywords.reduce((sum, keyword) => {
      return sum + (corpus.includes(keyword) ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestProfile = profile;
      bestScore = score;
    }
  }

  if (bestScore <= 0) {
    return {
      name: "Mixed Cinema",
      description:
        "Подборка звучит как маленький фильм из разных состояний. Для такого плейлиста лучше работает не один жанр, а цельная история и настроение момента.",
      colors: ["#f2e0c7", "#587067", "#c46544"],
      brief:
        "Оформление как персональная сцена из фильма: собрать вокруг повода и человека, а не вокруг одного жанрового клише."
    };
  }

  return bestProfile;
}

function updateSwatches(colors) {
  swatchesEl.innerHTML = "";
  colors.forEach((color) => {
    const swatch = document.createElement("span");
    swatch.style.setProperty("--swatch", color);
    swatchesEl.appendChild(swatch);
  });
}

function updateLabOutput() {
  trackCountEl.textContent = String(labState.tracks.length);
  totalDurationEl.textContent = formatDuration(labState.totalSeconds);
  formatRecommendationEl.textContent = labState.format;
  sideSplitEl.textContent = labState.split;
  fitPill.textContent = detectFitStatus(labState.totalSeconds);

  if (labState.mood) {
    moodNameEl.textContent = labState.mood.name;
    moodDescriptionEl.textContent = labState.mood.description;
    briefCopyEl.textContent = labState.mood.brief;
    updateSwatches(labState.mood.colors);
  }

  const estimateNote = labState.estimateUsed
    ? " Есть строки без тайминга, поэтому часть расчета приблизительная."
    : "";

  syncedSummaryEl.textContent = labState.tracks.length
    ? `Плейлист: ${labState.tracks.length} треков, ${formatDuration(labState.totalSeconds)}, рекомендованный формат — ${labState.format}, направление — ${labState.mood.name}.${estimateNote}`
    : "Пока ничего не синхронизировано. Сначала проанализируйте плейлист выше.";
}

function analyzePlaylist() {
  const lines = playlistInput.value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    labState = {
      tracks: [],
      totalSeconds: 0,
      mood: {
        name: "Вставьте плейлист, и я поймаю его настроение",
        description:
          "Сайт предложит настроение, палитру и характер упаковки, чтобы бриф был осмысленным уже на первом сообщении.",
        colors: ["#d0c4b0", "#8c6a43", "#2d2b2a"],
        brief:
          "После анализа здесь появится короткая концепция оформления, которую можно сразу отправить в заказ."
      },
      format: "—",
      split: "—",
      estimateUsed: false
    };
    updateLabOutput();
    return;
  }

  const tracks = lines.map(parseLine);
  const totalSeconds = tracks.reduce((sum, track) => sum + track.duration, 0);
  const mood = chooseMood(tracks);
  const estimateUsed = tracks.some((track) => track.estimated);

  labState = {
    tracks,
    totalSeconds,
    mood,
    format: detectFormat(totalSeconds),
    split: splitSides(tracks, totalSeconds),
    estimateUsed
  };

  updateLabOutput();
  generateBrief(false);
}

function buildBrief() {
  const name = document.querySelector("#customer-name").value.trim() || "Не указано";
  const contact = document.querySelector("#customer-contact").value.trim() || "Не указано";
  const recipient = document.querySelector("#recipient-name").value.trim() || "Не указано";
  const occasion = document.querySelector("#occasion").value;
  const packageName = document.querySelector("#package-select").value;
  const deadline = document.querySelector("#deadline").value || "Не указано";
  const story = document.querySelector("#story").value.trim() || "Без доп. описания";
  const giftMode = document.querySelector("#gift-mode").checked ? "Да" : "Нет";

  const playlistSummary = labState.tracks.length
    ? `${labState.tracks.length} треков / ${formatDuration(labState.totalSeconds)} / ${labState.format}`
    : "Плейлист еще не анализировали";
  const moodSummary = labState.mood ? labState.mood.name : "—";
  const conceptSummary = labState.mood ? labState.mood.brief : "—";
  const trackPreview = labState.tracks.length
    ? labState.tracks
        .slice(0, 8)
        .map((track, index) => `${index + 1}. ${track.title}`)
        .join("\n")
    : "—";

  return `Заявка на кастомную кассету

Клиент: ${name}
Контакт: ${contact}
Для кого: ${recipient}
Повод: ${occasion}
Формат: ${packageName}
Нужно к дате: ${deadline}
Gift-режим: ${giftMode}

Плейлист:
${playlistSummary}
Стороны: ${labState.split}
Mood-направление: ${moodSummary}
Концепция оформления: ${conceptSummary}

Коротко про историю:
${story}

Первые треки:
${trackPreview}
`;
}

function generateBrief(announceCopyState = false) {
  const brief = buildBrief();
  briefPreviewEl.textContent = brief;

  if (announceCopyState) {
    copyStatusEl.textContent = "бриф обновлен";
  }
}

function setPreset(event) {
  const preset = event.currentTarget.dataset.preset;
  playlistInput.value = presets[preset] ?? "";
  analyzePlaylist();
}

async function copyBrief() {
  const text = briefPreviewEl.textContent.trim();

  if (!text || text === "Здесь появится аккуратно собранный текст заявки.") {
    copyStatusEl.textContent = "сначала соберите заявку";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copyStatusEl.textContent = "скопировано";
  } catch (error) {
    copyStatusEl.textContent = "не удалось скопировать";
  }
}

function setupReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14
    }
  );

  elements.forEach((element) => observer.observe(element));
}

analyzeButton.addEventListener("click", analyzePlaylist);
clearButton.addEventListener("click", () => {
  playlistInput.value = "";
  analyzePlaylist();
});

presetButtons.forEach((button) => button.addEventListener("click", setPreset));

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  generateBrief(true);
});

copyBriefButton.addEventListener("click", copyBrief);

[
  "#customer-name",
  "#customer-contact",
  "#recipient-name",
  "#occasion",
  "#package-select",
  "#deadline",
  "#story",
  "#gift-mode"
].forEach((selector) => {
  const element = document.querySelector(selector);
  element.addEventListener("input", () => generateBrief(false));
  element.addEventListener("change", () => generateBrief(false));
});

setupReveal();
playlistInput.value = presets.night;
analyzePlaylist();
