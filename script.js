const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');
const toggleButton = document.querySelector('.theme-toggle');
const historyContainer = document.querySelector('.history');
const clearHistoryBtn = document.querySelector('.clear-history');

function appendValue(val) {
  const lastChar = display.value.slice(-1);
  const operators = ['+', '-', '*', '/', '.'];

  if (
    (operators.includes(lastChar) && operators.includes(val)) ||
    (val === '.' && display.value.split(/[\+\-\*\/]/).pop().includes('.'))
  ) {
    return;
  }

  display.value += val;
}

function addToHistory(expr, result) {
  const entry = document.createElement('div');
  entry.textContent = `${expr} = ${result}`;
  historyContainer.appendChild(entry);
  historyContainer.scrollTop = historyContainer.scrollHeight;
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (value === '=') {
      try {
        const result = eval(display.value);
        addToHistory(display.value, parseFloat(result.toFixed(10)));
        display.value = result;
      } catch {
        display.value = 'Error';
      }
    } else if (value === 'C') {
      display.value = '';
    } else if (value === 'DEL') {
      display.value = display.value.slice(0, -1);
    } else if (value === '√') {
      display.value += 'Math.sqrt(';
    } else if (value === '%') {
      display.value += '/100';
    } else if (value === '🌙' || value === '☀️') {
      // handled below
    } else if (value === 'AC') {
      historyContainer.innerHTML = '';
    } else {
      appendValue(value);
    }
  });
});

toggleButton.addEventListener('click', () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  toggleButton.textContent = isDark ? '🌙' : '☀️';
});

document.addEventListener('keydown', (event) => {
  const key = event.key;
  const allowed = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','(',')','%'];

  if (allowed.includes(key)) {
    appendValue(key);
    pressButton(key);
  } else if (key === 'Enter') {
    try {
      const result = eval(display.value);
      addToHistory(display.value, parseFloat(result.toFixed(10)));
      display.value = result;
    } catch {
      display.value = 'Error';
    }
    pressButton('=');
  } else if (key === 'Backspace') {
    display.value = display.value.slice(0, -1);
    pressButton('DEL');
  } else if (key.toLowerCase() === 'c') {
    display.value = '';
    pressButton('C');
  }
});

function pressButton(label) {
  const button = Array.from(buttons).find(btn => btn.textContent === label);
  if (button) {
    button.classList.add('pressed');
    setTimeout(() => button.classList.remove('pressed'), 150);
  }
}
