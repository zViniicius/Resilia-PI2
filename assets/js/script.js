// Into.JS Config
introJs()
	.setOptions({
		prevLabel: 'Anterior',
		nextLabel: 'Próximo',
		doneLabel: 'Finalizar',
		dontShowAgainLabel: 'Não mostrar novamente',
		dontShowAgain: true,
		autoPosition: true,
		keyboardNavigation: true,
		nextToDone: true,
		steps: [
			{
				title: '📑TUTORIAL',
				intro: '👋Olá!<br> Vamos começar com um breve tutorial? ',
			},
			{
				title: '📩Mensagem',
				element: document.querySelector('#textareaMsg'),
				intro:
					'Neste campo você pode nós contar o seu segredo mais profundo, prometemos guardá-lo às 7 chaves!🤐',
			},
			{
				title: '🔑Criptografia',
				element: document.querySelector('.hashs'),
				intro:
					'Nesta parte, você deverá selecionar o nível de criptografia para guardarmos o seu segredo.',
			},
			{
				title: '🔒Operação',
				element: document.querySelector('.operations'),
				intro: 'Por ultimo, escolha qual tipo de operação você deseja realizar!',
			},
			{
				title: '📣Dica Extra',
				element: document.querySelector('#text'),
				intro:
					'Você pode clicar no no texto criptografado para copiá-lo para a area de transferência.',
			},
			{
				title: '🔂Rever Tutorial',
				element: document.querySelector('#help'),
				intro: 'Caso queira rever este tutorial, clique neste ícone!',
			},
		],
	})
	.start();

//==Base64 Func==
const encodeBase64 = (phrase) => btoa(phrase); // Encode
const decodeBase64 = (phrase) => atob(phrase); // Decode

// Hash descriptions
const DESC_HASH = [
	'Seja bem vindo à Secret Box!',
	'Base64 é um termo genérico para vários esquemas de codificação semelhantes que codificam dados binários, tratando-os numericamente e traduzindo-os em uma representação de base 64. O termo Base64 se origina de uma codificação específica de transferência de conteúdo MIME. ',
	'A Cifra de César, também conhecida como cifra de troca, código de César ou troca de César, é uma das mais simples e conhecidas técnicas de criptografia. ',
	'Cifra de Vigenère é um método de criptografia que usa uma série de diferentes cifras de Cesar com base em letras de uma palavra-chave. É um dos métodos de criptografia mais antigos e mais famosos, desenvolvido por Blaise de Vigenère no século XVI. ',
];

// Global Checks
$(document).on('mouseover', () => {
	// Check conditions to enable action button
	if ($('#textareaMsg').val() != '') {
		if ($('#selectHash option:selected').val() == '1') {
			$('.btn').prop('disabled', false);
		} else if ($('#selectHash option:selected').val() == '2') {
			Number(
				$('#rangeCifraCesar').val() > 0
					? $('.btn').prop('disabled', false)
					: $('.btn').prop('disabled', true)
			);
		} else if ($('#selectHash option:selected').val() == '3') {
			$('#inputCifraVigenere').val() != ''
				? $('.btn').prop('disabled', false)
				: $('.btn').prop('disabled', true);
		}
	} else {
		$('.btn').prop('disabled', true);
	}
});

// Welcome msg
$(document).ready(() => {
	let welcome = DESC_HASH[$('#selectHash option:selected').val()].split('');
	welcome.forEach((letter, i) => {
		$('#selectHash').on('change', () => clearTimeout(ins) & $('#text').text(''));
		let ins = setTimeout(() => {
			$('#text').append(letter);
		}, 30 * i);
	});
});

// Copy to clipboard func
$('.container.output').on('click', () => {
	var $tempElement = $('<input>');
	$('body').append($tempElement);
	$tempElement.val($('.btn-copy').text()).select();
	document.execCommand('copy');
	$tempElement.remove();
});

// Enable tutorial on load
$('#help').on('click', () => {
	document.cookie = 'introjs-dontShowAgain=false';
	location.reload();
});

// Func to handle rangebar
$('#rangeCifraCesar').on('mousemove', () => {
	$('#labelCifraCesar').text($('#rangeCifraCesar').val());
});

// Change action button and placeholder texts
$('input[name=typeOP]').on('change', () => {
	typeOP = $('input[name=typeOP]:checked').val();
	$('.btn').text(typeOP);
	$('#textareaMsg').attr('placeholder', `Qual segredo você quer ${typeOP.toLowerCase()} hoje?`);
});

// Main func to call encrypt/decrypt funcs
$('.btn').on('click', () => {
	$('#text').text('');
	typeOP = $('input[name=typeOP]:checked').val();

	let phrase = $('#textareaMsg').val();
	let keyCC = Number($('#rangeCifraCesar').val());
	let keyVC = $('#inputCifraVigenere').val();
	let result = '';

	if (typeOP === 'Codificar') {
		if ($('#selectHash option:selected').val() === '1') {
			result = encodeBase64(phrase);
		} else if ($('#selectHash option:selected').val() === '2') {
			result = encodeCC(phrase, keyCC);
		} else if ($('#selectHash option:selected').val() === '3') {
			result = encodeVC(phrase, keyVC);
		}
	} else if (typeOP === 'Decodificar') {
		if ($('#selectHash option:selected').val() === '1') {
			result = decodeBase64(phrase);
		} else if ($('#selectHash option:selected').val() === '2') {
			result = decodeCC(phrase, keyCC);
		} else if ($('#selectHash option:selected').val() === '3') {
			result = decodeVC(phrase, keyVC);
		}
	}
	// set$('#text').text(result);

	result.split('').forEach((letter, i) => {
		$('.btn').on('click', () => clearTimeout(ins));
		let ins = setTimeout(() => {
			$('#text').append(letter);
		}, 50 * i);
	});
	$('.container.output').hasClass('btn-copy') ? '' : $('.container.output').addClass('btn-copy');
});

$('#selectHash').change(function () {
	$('.container.output').hasClass('btn-copy') ? $('.container.output').removeClass('btn-copy') : '';

	let hashSelected = $('#selectHash option:selected').val();
	let rangeCC = $('#rangeCifraCesar'),
		labelCC = $('#labelCifraCesar');

	let inputVC = $('#inputCifraVigenere');
	let divKey = $('#divKey');

	if (hashSelected === '1') {
		divKey.fadeOut().css('display', 'none');
	} else if (hashSelected === '2') {
		divKey.fadeIn('slow').css('display', 'flex'),
			rangeCC.fadeIn('slow'),
			labelCC.fadeIn('slow'),
			inputVC.hide();
	} else if (hashSelected === '3') {
		divKey.fadeIn('slow').css('display', 'flex'),
			rangeCC.hide(),
			labelCC.hide(),
			inputVC.fadeIn('slow');
	}

	// Func to write desc each hash
	let select = DESC_HASH[$('#selectHash option:selected').val()].split('');
	select.forEach((letter, i) => {
		$('#selectHash').on('change', () => clearTimeout(ins) & $('#text').text(''));
		$('.btn').on('click', () => clearTimeout(ins));
		let ins = setTimeout(() => {
			$('#text').append(letter);
		}, 30 * i);
	});
});

//===============Funcs to Encrypt===============

//==Cifra de Cesar==
const encodeCC = (phrase, key) => {
	let encodedPhrase = '';

	for (let i = 0; i < phrase.length; i++) {
		let charAscii = phrase.charCodeAt(i);

		// If upperCaseChar (Character 65-90)
		if (charAscii >= 65 && charAscii <= 90) {
			// Apply CC
			charAscii += key;

			if (charAscii > 90) {
				charAscii = charAscii - 90 + 64;
			}
		}

		// If lowerCaseChar (Character 97-122)
		if (charAscii >= 97 && charAscii <= 122) {
			// Apply CC
			charAscii += key;

			if (charAscii > 122) {
				charAscii = charAscii - 122 + 96;
			}
		}
		// If Special Char
		encodedPhrase += String.fromCharCode(charAscii);
	}
	return encodedPhrase;
};

//==Cifra de Vigenère==
const encodeVC = (phrase, key) => {
	// Modify to upperCase
	phrase = phrase.toUpperCase().trim();
	key = key.toUpperCase().trim();

	let encodedPhrase = '';
	let keyIndex = 0;

	for (let i = 0; i < phrase.length; i++) {
		let charAsciiVC = phrase.charCodeAt(i);

		if (charAsciiVC >= 65 && charAsciiVC <= 90) {
			// If is a word, apply VC
			encodedPhrase += String.fromCharCode(
				((charAsciiVC - 65 + key.charCodeAt(keyIndex) - 65) % 26) + 65
			);
			keyIndex = (keyIndex + 1) % key.length;
		} else {
			// If Special char, only reply
			encodedPhrase += phrase.charAt(i);
		}
	}
	return encodedPhrase;
};

//===============Funcs to Decrypt===============

//==Cifra de Cesar==
const decodeCC = (phrase, key) => {
	let decodedPhrase = '';

	for (let i = 0; i < phrase.length; i++) {
		let charAscii = phrase.charCodeAt(i);

		// If upperCaseChar (Character 65-90)
		if (charAscii >= 65 && charAscii <= 90) {
			// Apply CC
			charAscii -= key;

			if (charAscii < 65) {
				charAscii = 91 - (65 - charAscii);
			}
		}

		// If lowerCaseChar (Character 97-122)
		if (charAscii >= 97 && charAscii <= 122) {
			// Apply CC
			charAscii -= key;

			if (charAscii < 97) {
				charAscii = 123 - (97 - charAscii);
			}
		}
		// If Special Char
		decodedPhrase += String.fromCharCode(charAscii);
	}
	return decodedPhrase;
};

//==Cifra de Vigenère==
const decodeVC = (phrase, key) => {
	// Modify to upperCase
	phrase = phrase.toUpperCase().trim();
	key = key.toUpperCase().trim();

	let decodedPhrase = '';
	let keyIndex = 0;

	for (let i = 0; i < phrase.length; i++) {
		let charAsciiVC = phrase.charCodeAt(i);

		if (charAsciiVC >= 65 && charAsciiVC <= 90) {
			// If is a word, apply VC
			decodedPhrase += String.fromCharCode(
				((charAsciiVC - 65 - (key.charCodeAt(keyIndex) - 65) + 26) % 26) + 65
			);
			keyIndex = (keyIndex + 1) % key.length;
		} else {
			// If Special char, only reply
			decodedPhrase += phrase.charAt(i);
		}
	}
	return decodedPhrase;
};
