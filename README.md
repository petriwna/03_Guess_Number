# Application “Guess Number”

---

Web додаток, при запуску якого користувачеві пропонується вгадати число
від 1 до 100 за 5 спроб. У реалізації необхідно передбачити варіант налаштувань
діапазону чисел (валідація: не негативні, без плаваючої точки, мінімум = 1,
максимум = 200) та кількості спроб (валідація: не негативні, без плаваючої
крапки, мінімум = 1, максимум = 15).


Гра починається з того, що користувач бачить повідомлення: Привіт, я загадав
число від min до max діапазону. Спробуй вгадати його за x спроб!” І
користувачеві пропонується використовувати свою першу спробу шляхом введення першого
числа в інпут і натиснути кнопку GENERATE.

**Примітка:** у будь-який момент часу, користувач може припинити гру натиснувши
на кнопку EXIT, після чого гра моментально зупиниться.

З другої спроби користувача вводяться підказки, типу: “Не вгадав, але
тепліше! Залишилося n спроб” чи “Не вгадав, холодніше... Залишилося n спроб”.
Якщо користувач вгадав число – виводиться повідомлення “Вітаю! Ти вгадав
задумане число за n спроб”.

Інші дрібні доопрацювання - на розсуд розробника.