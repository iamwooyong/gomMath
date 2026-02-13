const tarotCards = [
  {
    title: "방랑자 고양이",
    number: "0",
    emoji: "🐈",
    quote: "생각은 그만! 지금은 마음이 이끄는 대로 가볍게 시작할 때.",
    desc: "조각난 옷을 입은 고양이가 세상 끝에서 망설임 없이 첫발을 내딛으려 한다. 그의 시선은 낭떠러지가 아니라 춤추는 나비를 따른다.",
    tags: ["#새로운 시작", "#순수한 마음", "#자유로운 영혼"],
    art: "radial-gradient(circle at 85% 12%, #fff8bb7a 0 10%, transparent 11%), linear-gradient(180deg, #a7cedf 0 58%, #88a868 59% 100%)"
  },
  {
    title: "달빛 여사제",
    number: "2",
    emoji: "🌙",
    quote: "답을 밖에서 찾지 말고, 네 안의 조용한 직감을 들어봐.",
    desc: "은빛 장막 뒤의 여사제가 속삭인다. 조용히 가라앉힌 마음은 이미 알고 있던 진실을 선명하게 떠올린다.",
    tags: ["#직감", "#내면의 지혜", "#침묵의 힘"],
    art: "radial-gradient(circle at 18% 20%, #fff8dd6a 0 13%, transparent 14%), linear-gradient(180deg, #5f6ba7 0 60%, #404a84 61% 100%)"
  },
  {
    title: "태양 사자",
    number: "19",
    emoji: "🦁",
    quote: "주저하지 마. 지금의 너는 빛을 나눌 준비가 되었어.",
    desc: "찬란한 태양 아래 사자가 웃으며 걷는다. 자신감과 기쁨이 주변 사람들에게도 용기를 퍼뜨린다.",
    tags: ["#성공", "#자신감", "#밝은 에너지"],
    art: "radial-gradient(circle at 52% 18%, #fff7b1 0 18%, transparent 19%), linear-gradient(180deg, #ffd18e 0 60%, #eb9b59 61% 100%)"
  },
  {
    title: "별의 정원사",
    number: "17",
    emoji: "⭐",
    quote: "천천히라도 괜찮아. 네가 심은 희망은 반드시 자라난다.",
    desc: "별빛 물을 뿌리는 정원사는 오늘도 씨앗을 돌본다. 당장의 결과보다 꾸준한 돌봄이 미래를 만든다.",
    tags: ["#희망", "#회복", "#장기전"],
    art: "radial-gradient(circle at 75% 24%, #fff7dc7a 0 11%, transparent 12%), linear-gradient(180deg, #7fc3dd 0 62%, #5da174 63% 100%)"
  }
];

const drawBtn = document.querySelector("#drawBtn");
const tarotCardEl = document.querySelector("#tarotCard");
const cardTitleEl = document.querySelector("#cardTitle");
const cardQuoteEl = document.querySelector("#cardQuote");
const cardDescEl = document.querySelector("#cardDesc");
const fortuneTitleEl = document.querySelector("#fortuneTitle");
const fortuneMetaEl = document.querySelector("#fortuneMeta");
const cardArtEl = document.querySelector("#cardArt");
const cardHeadEl = document.querySelector(".card-head");
const tagBox = document.querySelector("#tagBox");
const kakaoLoginBtn = document.querySelector("#kakaoLoginBtn");

const KAKAO_JS_KEY = "";
const KAKAO_REDIRECT_URI = window.location.origin + window.location.pathname;

let currentIndex = 0;

function renderTags(tags) {
  tagBox.innerHTML = tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
}

function renderCard(index) {
  const card = tarotCards[index];
  cardHeadEl.textContent = card.number;
  cardTitleEl.textContent = card.title;
  cardQuoteEl.textContent = `“${card.quote}”`;
  cardDescEl.textContent = card.desc;
  cardArtEl.textContent = card.emoji;
  cardArtEl.style.background = card.art;
  renderTags(card.tags);
}

function getDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFortuneMessage(card) {
  const moods = {
    "0": "새로운 기운이 열립니다. 고민보다 실행이 운을 끌어와요.",
    "2": "서두르지 말고 직감을 믿어보세요. 조용한 선택이 정답입니다.",
    "17": "회복과 희망의 하루입니다. 천천히 가도 결과는 따라옵니다.",
    "19": "상승운이 강합니다. 자신감 있게 드러낼수록 기회가 커져요."
  };
  return moods[card.number] || "오늘은 중심을 잡고 차분히 움직이면 좋은 흐름이 이어집니다.";
}

function drawTodayTarot() {
  tarotCardEl.classList.remove("animating");
  void tarotCardEl.offsetWidth;
  tarotCardEl.classList.add("animating");

  const todayKey = getDateKey();
  const storageKey = "tarotMate:todayTarot";
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");

  if (saved?.date === todayKey && Number.isInteger(saved.index)) {
    currentIndex = saved.index;
  } else {
    currentIndex = Math.floor(Math.random() * tarotCards.length);
    localStorage.setItem(storageKey, JSON.stringify({ date: todayKey, index: currentIndex }));
  }

  const todayCard = tarotCards[currentIndex];
  renderCard(currentIndex);

  fortuneTitleEl.textContent = `오늘의 타로: ${todayCard.title}`;
  cardDescEl.textContent = `${todayCard.desc} ${getFortuneMessage(todayCard)}`;
  fortuneMetaEl.textContent = `${todayKey} 기준 오늘의 카드입니다.`;
  drawBtn.textContent = "✦ 오늘의 운세 다시 보기";
}

drawBtn.addEventListener("click", drawTodayTarot);
renderCard(currentIndex);

function initKakaoLogin() {
  if (!kakaoLoginBtn) return;

  kakaoLoginBtn.addEventListener("click", () => {
    if (!window.Kakao) {
      alert("카카오 SDK 로드에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (!KAKAO_JS_KEY) {
      alert("app.js에 KAKAO_JS_KEY를 먼저 설정해 주세요.");
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JS_KEY);
    }

    window.Kakao.Auth.authorize({
      redirectUri: KAKAO_REDIRECT_URI
    });
  });
}

initKakaoLogin();
