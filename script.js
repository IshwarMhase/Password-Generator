
console.clear();
// Range Slider Background
const sliderProps = {
	fill: "#243b55",
	background: "rgba(255, 255, 255, 0.214)",
};


const slider = document.querySelector(".range__slider");

const sliderValue = document.querySelector(".length__title");

// Event Listener to apply the fill and furthermore change the value of the text.
slider.querySelector("input").addEventListener("input", event => {
	sliderValue.setAttribute("data-length", event.target.value);
	applyFill(event.target);
});
applyFill(slider.querySelector("input"));


function applyFill(slider) {
	const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
	const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage +
			0.1}%)`;
	slider.style.background = bg;
	sliderValue.setAttribute("data-length", slider.value);
}

// Object of all the function names that we will use to create random letters of password.
const randomFunc = {
	lower: getRandomLowervalue,
	upper: getRandomUppervalue,
	number: getRandomNumbervalue,
	symbol: getRandomSymbolvalue,
};

// Random more secure value.
function secureMathRandom() {
	return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
}


// Every one of the functions that are capable to return an arbitrary value that we will use to make secret phrases.
function getRandomLowervalue() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUppervalue() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumbervalue() {
	return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
}
function getRandomSymbolvalue() {
	const symbols = '~!@#$%^&*()_+{}":?><;.,';
	return symbols[Math.floor(Math.random() * symbols.length)];
}



// Viewbox where the outcome will be shown.
const resultEl = document.getElementById("result");
// The input slider will use to change the length of the password.
const lengthEl = document.getElementById("slider");



// Checkboxes address the choices that are capable to make different sorts of passwords dependent on the user.
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");



// Button to generate the password.
const generateBtn = document.getElementById("generate");
// Button to copy the text.
const copyBtn = document.getElementById("copy-btn");
// Result viewbox container.
const resultContainer = document.querySelector(".result");

// Text info showed after generate button is clicked.
const copyInfo = document.querySelector(".result__info.right");
// Text appear after copy button is clicked.
const copiedInfo = document.querySelector(".result__info.left");

// Assuming this variable is true really at that time, the copyBtn will show up, for example at the point when the client first clicks generate tthe copyBth will interact.
let generatedPassword = false;

// Update CSS Properties of the COPY button and Get the limits of the outcome view box container.
let resultContainerBound = {
	left: resultContainer.getBoundingClientRect().left,
	top: resultContainer.getBoundingClientRect().top,
};



// This will refresh the situation of the duplicate button dependent on mouse Position.
resultContainer.addEventListener("mousemove", e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	};
	if(generatedPassword){
		copyBtn.style.opacity = '1';
		copyBtn.style.pointerEvents = 'all';
		copyBtn.style.setProperty("--x", `${e.x - resultContainerBound.left}px`);
		copyBtn.style.setProperty("--y", `${e.y - resultContainerBound.top}px`);
	}else{
		copyBtn.style.opacity = '0';
		copyBtn.style.pointerEvents = 'none';
	}
});
window.addEventListener("resize", e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	};
});



// When Generate is clicked Password id generated.
generateBtn.addEventListener("click", () => {
	const length = +lengthEl.value;
	const hasLower = lowercaseEl.checked;
	const hasUpper = uppercaseEl.checked;
	const hasNumber = numberEl.checked;
	const hasSymbol = symbolEl.checked;
	generatedPassword = true;
	resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
	copyInfo.style.transform = "translateY(0%)";
	copyInfo.style.opacity = "0.75";
	copiedInfo.style.transform = "translateY(200%)";
	copiedInfo.style.opacity = "0";
});



// Copy Password in clipboard.
copyBtn.addEventListener("click", () => {
	const textarea = document.createElement("textarea");
	const password = resultEl.innerText;
	if (!password || password == "CLICK GENERATE") {
		return;
	}
	textarea.value = password;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("copy");
	textarea.remove();

	copyInfo.style.transform = "translateY(200%)";
	copyInfo.style.opacity = "0";
	copiedInfo.style.transform = "translateY(0%)";
	copiedInfo.style.opacity = "0.75";
});



// This Function is capable to produce passwords and afterward bringing them back.
function generatePassword(length, lower, upper, number, symbol) {
	let generatedPassword = "";
	const typesCount = lower + upper + number + symbol;
	const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);
	if (typesCount === 0) {
		return "";
	}
	for (let i = 0; i < length; i++) {
		typesArr.forEach(type => {
			const funcName = Object.keys(type)[0];
			generatedPassword += randomFunc[funcName]();
		});
	}
	return generatedPassword.slice(0, length) 
									.split('').sort(() => Math.random() - 0.5)
									.join('');
}



// A function that handles the checkboxes state, so at least one should be chosen. The last checkbox will be debilitated.
function disableOnlyCheckbox(){
	let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked)
	totalChecked.forEach(el => {
		if(totalChecked.length == 1){
			el.disabled = true;
		}else{
			el.disabled = false;
		}
	})
}

[uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
	el.addEventListener('click', () => {
		disableOnlyCheckbox()
	})
})