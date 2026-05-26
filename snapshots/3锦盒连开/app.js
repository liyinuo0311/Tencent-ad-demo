const boxBrands = [
  {
    caption: "一号锦盒",
  },
  {
    caption: "二号锦盒",
  },
  {
    caption: "三号锦盒",
  },
];

const rewardPool = [
  {
    tier: "商品优惠券",
    title: "云锦茶饮 8 元优惠券",
    desc: "同款品牌物料已随锦盒带出，可用于指定春山茉莉轻乳茶商品。",
    brand: {
      name: "云锦茶饮",
      product: "春山茉莉轻乳茶",
      mark: "茶",
    },
    icon: "券",
    productPage: "./jd_product.html?item=tea",
  },
  {
    tier: "会员权益",
    title: "腾讯视频 1 天会员",
    desc: "观剧权益已收入锦囊，适合解锁今日追剧高光时刻。",
    brand: {
      name: "腾讯视频",
      product: "1 天会员权益",
      mark: "V",
    },
    icon: "V",
  },
  {
    tier: "商品优惠券",
    title: "京东周边 15 元优惠券",
    desc: "可用于指定《影游共生》联名徽章、立牌等周边商品。",
    brand: {
      name: "京东周边",
      product: "联名徽章/立牌",
      mark: "京",
    },
    icon: "券",
    productPage: "./jd_product.html?item=badge",
  },
];

const boxes = document.querySelector("#boxes");
const modal = document.querySelector("#rewardModal");
const rewardTitle = document.querySelector("#rewardTitle");
const rewardTier = document.querySelector("#rewardTier");
const rewardDesc = document.querySelector("#rewardDesc");
const rewardSeal = document.querySelector("#rewardSeal");
const modalBrand = document.querySelector("#modalBrand");
const resetBtn = document.querySelector("#resetBtn");
const useRewardBtn = document.querySelector("#useRewardBtn");
const roleScoreToast = document.querySelector("#roleScoreToast");
const MAIN_VIDEO_URL = "../../index.html";
let assignedRewards = [];
let hasSelectedBox = false;

function shuffleRewards() {
  return [...rewardPool]
    .map((reward) => ({ reward, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ reward }) => reward);
}

function brandTemplate(brand) {
  return `
    <span class="brand-icon">${brand.mark}</span>
    <span class="brand-copy">
      <strong>${brand.name}</strong>
      ${brand.product}
    </span>
  `;
}

function renderBoxes() {
  assignedRewards = shuffleRewards();
  hasSelectedBox = false;
  boxes.innerHTML = boxBrands
    .map(
      (brand, index) => `
        <button class="box-button" type="button" data-index="${index}" aria-label="开启${brand.caption}">
          <span class="box-art" aria-hidden="true">
            <span class="prize-glow"></span>
            <span class="chest-skin"></span>
          </span>
          <span class="box-caption">${brand.caption}</span>
        </button>
      `
    )
    .join("");
}

function burstSparkles(target) {
  const rect = target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height * 0.42;

  for (let i = 0; i < 16; i += 1) {
    const spark = document.createElement("i");
    const angle = (Math.PI * 2 * i) / 16;
    const distance = 34 + Math.random() * 44;
    spark.className = "spark";
    spark.style.left = `${centerX}px`;
    spark.style.top = `${centerY}px`;
    spark.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--y", `${Math.sin(angle) * distance - 24}px`);
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  }
}

function showReward(reward) {
  modalBrand.innerHTML = brandTemplate(reward.brand);
  rewardSeal.textContent = reward.icon;
  rewardTier.textContent = reward.tier;
  rewardTitle.textContent = reward.title;
  rewardDesc.textContent = reward.desc;
  if (reward.productPage) {
    useRewardBtn.hidden = false;
    useRewardBtn.dataset.url = reward.productPage;
    useRewardBtn.setAttribute("aria-label", `立即使用${reward.title}`);
  } else {
    useRewardBtn.hidden = true;
    delete useRewardBtn.dataset.url;
    useRewardBtn.removeAttribute("aria-label");
  }
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  showRoleScoreToast(true);
}

function showRoleScoreToast(isSuccess) {
  const role = localStorage.getItem("qingyunianSelectedRole") || "所选角色";
  const added = isSuccess ? 5 : 2;
  const total = Math.floor(Math.random() * 8001) + 2000;
  roleScoreToast.innerHTML = `为<strong>${role}</strong>加了<strong>${added}</strong>分<br>现在全服总分是：<strong>${total}</strong>`;
  roleScoreToast.classList.add("visible");
}

function openBox(button) {
  if (hasSelectedBox || button.classList.contains("opened")) return;

  const brandIndex = Number(button.dataset.index);
  const reward = assignedRewards[brandIndex];
  hasSelectedBox = true;
  button.classList.add("opened");
  button.setAttribute("aria-label", `已开启，获得${reward.title}`);
  boxes.querySelectorAll(".box-button").forEach((box) => {
    if (box !== button) {
      box.classList.add("locked");
      box.disabled = true;
      box.setAttribute("aria-label", `${box.textContent.trim()}已锁定`);
    }
  });
  burstSparkles(button);

  window.setTimeout(() => showReward(reward), 620);
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function returnToMainVideo() {
  window.location.assign(MAIN_VIDEO_URL);
}

boxes.addEventListener("click", (event) => {
  const button = event.target.closest(".box-button");
  if (!button) return;
  openBox(button);
});

modal.addEventListener("click", (event) => {
  if (event.target.matches(".modal-close")) {
    returnToMainVideo();
    return;
  }
  if (event.target.matches("[data-close]")) closeModal();
});

useRewardBtn.addEventListener("click", () => {
  const url = useRewardBtn.dataset.url;
  if (url) window.location.assign(url);
});

resetBtn.addEventListener("click", () => {
  renderBoxes();
  closeModal();
  roleScoreToast.classList.remove("visible");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("show")) returnToMainVideo();
});

renderBoxes();
