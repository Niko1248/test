const productsBtn = document.querySelectorAll('.product__btn');  // Получаем все кнопки добавления в корзину
const cartProductsList = document.querySelector('.cart-content__list'); // Получаем список элементов которые находятся внутри корзины, в него буду добавлять блоки
const cart = document.querySelector('.cart'); // Получаем селектор корзины чтобы добавлять цифры и классы active
const cartQuantity = document.querySelector('.cart__quantity'); // Получаем элемент отображения количества товаров в корзине
const fullprice = document.querySelector('.fullprice'); // Итоговая цена
let price = 0; // Накопительная переменная цены


//  Дает случайный id кажджому элементу чтобы можно было связывать карточку товара в окне и в корзине
const randomID = () => {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); 
};

// Убирает пробелы строки и всякие рубли
const priceWithoutSpaces = (str) => {
	return str.replace(/\s/g, '');
};

// Обратно преобразует в строку с пробелами + за счет String дополнительно преобразует в строку даже если будет число.
const normalPrice = (str) => {
	return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

// Функция которая добавляет значения в переменную
const plusFullPrice = (currentPrice) => {
	return price += currentPrice;
};


// Функция которая вычитает значения из переменной
const minusFullPrice = (currentPrice) => {
	return price -= currentPrice;
};

// Функция выводит итоговую сумму в корзине в нормальном виде
const printFullPrice = () => {
	fullprice.textContent = `${normalPrice(price)} ₽`;
};

const printQuantity = () => {
	let length = cartProductsList.querySelector('.simplebar-content').children.length; // Получаем количество товаров (li в simplebar-content)
	cartQuantity.textContent = length; // Записываем количество
	length > 0 ? cart.classList.add('active') : cart.classList.remove('active') //Если корзина не пустая то добавляем класс active иначе удалим его
};

// Функция для удаления продукта из корзины
const deleteProducts = (productParent) => {
	let id = productParent.querySelector('.cart-product').dataset.id; // Нашли id элемента лежащего в корзине
	document.querySelector(`.product[data-id="${id}"]`).querySelector('.product__btn').disabled = false; // Находим элемент с таким id и внутри него элемент кнопки, и снова активируем ее
	let currentPrice = parseInt(priceWithoutSpaces(productParent.querySelector('.cart-product__price').textContent)); // Получаем цену без пробелов которую хотим удалить из корзины
	minusFullPrice(currentPrice); // Вычитаем эту цену из итоговой
	printFullPrice(); // Выводим итоговую цену
	productParent.remove(); // Убираем из списка
	printQuantity(); // Выводим количество товаров в корзине
}


// Возращает внутреннюю разметку, т.е. вставляет в корзину в html  данные о товаре
const generateCartProduct = (img, title, price, id) => {
	return `

	<li class="cart-content__item">
		<article class="cart-content__product cart-product" data-id="${id}">
			<img src="${img}" alt="Макбук" class="cart-product__img">
			<div class="cart-product__text">
				<h3 class="cart-product__title">${title}</h3>
				<span class="cart-product__price">${normalPrice(price)} ₽</span>
			</div>
			<button class="cart-product__delete" aria-label="Удалить товар"></button>
		</article>
	</li>

	`;
}

productsBtn.forEach(el => { //Перебираем все кнопки добавления в корзину
	el.closest('.product').setAttribute('data-id', randomID()); // Находим у каждого элемента класс product (родительский) и добавляем дата атрибут со случайным id
	el.addEventListener('click' , (e) => {
		let self = e.currentTarget; // Текущий элемент по которому кликнули
		let parent = self.closest('.product'); // Находим текущий продукт
		let id = parent.dataset.id;  // Забираем id
		let img = parent.querySelector('.image-switch__img img').getAttribute('src'); // Забираем путь у картинки
		let title = parent.querySelector('.product__title').textContent; // Получаем текст заголовка
		let priceNumber = parseInt(priceWithoutSpaces(parent.querySelector('.product-price__current').textContent)); // Получаем цену в виде числа  без пробелов

		plusFullPrice(priceNumber); // Считаем сумму
		printFullPrice();						//Вывести полную сумму
		cartProductsList.querySelector('.simplebar-content').insertAdjacentHTML("afterbegin", generateCartProduct(img, title, priceNumber, id)); 		//Добавить в корзину
		printQuantity();						//Посчитать и выдать количество
		self.disabled = true;				//Заблокировать кнопку
	})
})

cartProductsList.addEventListener('click' , (e) => {
	if (e.target.classList.contains('cart-product__delete')) {
		deleteProducts(e.target.closest('.cart-content__item'));
	}
})