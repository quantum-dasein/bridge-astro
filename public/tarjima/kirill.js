// Узбекская латиница → кириллица для страницы слушателя.
//
// Зачем: значительная часть инженеров старшего поколения читает по-узбекски
// кириллицей быстрее, чем латиницей, а субтитры читают на ходу.
//
// Правила — официальное соответствие алфавитов: sh→ш, ch→ч, o‘→ў, g‘→ғ,
// yo/yu/ya/ye→ё/ю/я/е, e в начале слова и после гласной → э, отдельный
// апостроф (тутуқ белгиси) → ъ.
//
// Английские термины FIDIC (Variation, Claims, IPC, Taking-Over) модель
// оставляет латиницей, и здесь их не трогаем: аббревиатуры узнаются по
// заглавным буквам, остальные — по списку и по буквам c и w, которых в
// узбекской латинице нет (кроме ch). Это эвристика: редкое английское слово
// вне списка может проскочить в кириллицу.

(function () {
	var APOS = /[ʻ‘’'`ʼ]/;
	var MAP = {
		a: 'а', b: 'б', d: 'д', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л',
		m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в',
		x: 'х', y: 'й', z: 'з',
	};
	var VOWELS = 'aeiou';
	var FOREIGN = [
		'variation', 'claim', 'programme', 'taking', 'over', 'retention', 'determination',
		'submittal', 'entitlement', 'notice', 'cost', 'final', 'statement', 'discharge',
		'advance', 'payment', 'punch', 'list', 'planner', 'record', 'contemporary', 'built',
		'flow', 'down', 'method', 'fidic', 'daab',
	];

	function isForeign(w) {
		if (/^[A-Z]{2,}$/.test(w)) return true; // IPC, DAAB, EOT
		if (/c(?!h)|w/i.test(w)) return true;
		var low = w.toLowerCase();
		for (var i = 0; i < FOREIGN.length; i++) if (low.indexOf(FOREIGN[i]) === 0) return true;
		return false;
	}

	function word(w) {
		if (isForeign(w)) return w;
		var allUpper = w.length > 1 && w === w.toUpperCase();
		var out = '';
		for (var i = 0; i < w.length; ) {
			var c = w[i];
			var lc = c.toLowerCase();
			var next = (w[i + 1] || '').toLowerCase();
			var up = c !== lc;
			var r;
			var step = 1;

			if ((lc === 'o' || lc === 'g') && APOS.test(w[i + 1] || '')) {
				r = lc === 'o' ? 'ў' : 'ғ';
				step = 2;
			} else if (lc === 's' && next === 'h') {
				r = 'ш';
				step = 2;
			} else if (lc === 'c' && next === 'h') {
				r = 'ч';
				step = 2;
			} else if (lc === 'y' && 'ouae'.indexOf(next) >= 0 && next &&
				!(next === 'o' && APOS.test(w[i + 2] || ''))) {
				// yo‘l — это й + ў, а не ё
				r = { o: 'ё', u: 'ю', a: 'я', e: 'е' }[next];
				step = 2;
			} else if (APOS.test(c)) {
				r = 'ъ';
			} else if (lc === 'e') {
				var prev = (w[i - 1] || '').toLowerCase();
				r = i === 0 || prev === '-' || VOWELS.indexOf(prev) >= 0 ? 'э' : 'е';
			} else {
				r = MAP[lc] || c;
			}

			out += up ? r.toUpperCase() : r;
			i += step;
		}
		return allUpper ? out.toUpperCase() : out;
	}

	// Слово — буквы, апострофы внутри и дефисы между частями. Цифры, знаки и
	// кавычки остаются как есть.
	var TOKEN = /[A-Za-z]+(?:[ʻ‘’'`ʼ][A-Za-z]+)*(?:-[A-Za-z]+(?:[ʻ‘’'`ʼ][A-Za-z]+)*)*/g;

	globalThis.uzCyrillic = function (text) {
		return String(text).replace(TOKEN, word);
	};
})();
