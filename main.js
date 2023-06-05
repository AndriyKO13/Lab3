// Отримуємо кнопку "Додати товар"
const addButton = document.querySelector('.button-add');

// Отримуємо батьківський елемент, в якому будемо додавати нові рядки
const productSection = document.querySelector('.block-left');

// Отримуємо батьківський елемент для товарів, що залишилися
const remainingProductsSection = document.getElementById('remaining-products');

// Отримуємо батьківський елемент для куплених товарів
const boughtProductsSection = document.getElementById('bought-products');

// Функція для збереження даних в localStorage
function saveDataToLocalStorage() {
  const products = document.querySelectorAll('.product');
  const data = {};

  products.forEach((product, index) => {
    const nameElement = product.querySelector('.product-name');
    const countElement = product.querySelector('.count-display');

    const name = nameElement.textContent;
    const count = countElement.textContent;
    const isStrikethrough = nameElement.style.textDecoration === 'line-through';

    data[`product${index + 1}`] = {
      name: name,
      count: count,
      isStrikethrough: isStrikethrough
    };
  });

  localStorage.setItem('productData', JSON.stringify(data));
}

// Обробник події закриття сторінки
window.addEventListener('beforeunload', saveDataToLocalStorage);

// Функція для отримання даних із localStorage та їх обробка
function retrieveDataFromLocalStorage() {
  const data = localStorage.getItem('productData');

  if (data) {
    const parsedData = JSON.parse(data);

    Object.keys(parsedData).forEach((key) => {
      const product = parsedData[key];
      const name = product.name;
      const count = product.count;
      const isStrikethrough = product.isStrikethrough;

      // Обробка даних...
      console.log(`Назва продукту: ${name}`);
      console.log(`Кількість: ${count}`);
      console.log(`Закреслено: ${isStrikethrough}`);
      addProductFromLoad(name, count, isStrikethrough);
    });
  }
}

// Виклик функції при відкриванні сторінки
retrieveDataFromLocalStorage();





//Додаємо продукт на основі localStorage
function addProductFromLoad(productName, count, isStrikethrough) {
  // Перевіряємо, що поле "Назва товару" не пусте
  if (!productName || productName.trim() === '') {
    return; // Якщо поле пусте, виходимо з функції
  }

  // Перевіряємо, чи є вже такий товар в списку
  const existingProduct = Array.from(productSection.querySelectorAll('.product-name')).find(function (element) {
    return element.textContent === productName;
  });

  if (existingProduct) {
    // Якщо товар вже є, збільшуємо його кількість на 1
    /*const countDisplay = existingProduct.parentElement.querySelector('.count-display');
    let count = parseInt(countDisplay.textContent);
    count++;
    countDisplay.textContent = count;

    // Обновляем стили кнопки "-"
    const minusButton = existingProduct.parentElement.querySelector('.round-button-red');
    /*if (count === 1) {
      minusButton.classList.add('disabled-round-button-red');
      minusButton.classList.remove('round-button-red');
    } else {
      minusButton.classList.remove('disabled-round-button-red');
      minusButton.classList.add('round-button-red');
    }*/

    // Оновлюємо кількість товару в розділі "Залишилось"
    const remainingProducts = remainingProductsSection.querySelectorAll('.product-icon');
    const remainingProduct = Array.from(remainingProducts).find(function (element) {
      return element.querySelector('.icon-product-name').textContent === productName;
    });
    if (remainingProduct) {
      const remainingProductQuantity = remainingProduct.querySelector('.icon-product-quantity');
      remainingProductQuantity.textContent = count;
    }
  } else {
    // Якщо товару ще нема в списку, створюємо новий елемент

    // Створюємо новий елемент с класом "product"
    const newProduct = document.createElement('section');
    newProduct.className = 'product';
    if (!isStrikethrough) {
      let productContent = '';
      if (count == 1) {
        // Створюємо вміст нової стрічки товару
        productContent = `
          <h3 class="product-name" contenteditable="true">${productName.trim()}</h3>
          <section class="counter">
            <button class="round-button-red disabled-round-button-red" data-tooltip="Мінус">-</button>
            <div class="count-display">${count}</div>
            <button class="round-button-green" data-tooltip="Плюс">+</button>
          </section>
          <section class="buy-section">
            <button class="button-bought" data-tooltip="Куплено">Куплено</button>
            <button class="button-square" data-tooltip="Видалити товар">✕</button>
          </section>
        `;
      }
      else {
        // Створюємо вміст нової стрічки товару
        productContent = `
          <h3 class="product-name" contenteditable="true">${productName.trim()}</h3>
          <section class="counter">
            <button class="round-button-red" data-tooltip="Мінус">-</button>
            <div class="count-display">${count}</div>
            <button class="round-button-green" data-tooltip="Плюс">+</button>
          </section>
          <section class="buy-section">
            <button class="button-bought" data-tooltip="Куплено">Куплено</button>
            <button class="button-square" data-tooltip="Видалити товар">✕</button>
          </section>
        `;
      }

        // Встановлюємо вміст нового елемента
        newProduct.innerHTML = productContent;

        console.log(count);

        // Додаємо нову стрічку товару в батьківський елемент
        productSection.appendChild(newProduct);

        // Також додаємо новий товар в область "Залишилось"
        const remainingProduct = document.createElement('section');
        remainingProduct.className = 'product-icon';
        remainingProduct.innerHTML = `
          <span class="icon-product-name">${productName.trim()}</span>
          <div class="icon-product-quantity">${count}</div>
        `;
        remainingProductsSection.appendChild(remainingProduct);

        // В блоці відбувається оновлення списку елементів, на які ставиться слухач зміни назви
        const editableElements = newProduct.querySelectorAll('.product-name');

        // Перебрати кожен елемент
        editableElements.forEach(element => {
          let initialText; // Змінна для початкового тексту

          // Додаємо обробник кліку
          element.addEventListener('click', function (event) {
            // Оновлюємо значення змінної з початковим текстом
            initialText = event.target.textContent;
          });

          // Додати обробник події input
          element.addEventListener('input', function (event) {
            // Отримуємо новий текст після змін
            //const newText = event.target.textContent;
            let newText = event.target.textContent;

            // Перевіряємо, чи є вже такий товар в списку
            /*var existingProduct = Array.from(productSection.querySelectorAll('.product-name')).find(function (element) {
              return element.textContent === newText;
            });*/

            const matchingElements = Array.from(productSection.querySelectorAll('.product-name')).filter(function (element) {
              return element.textContent === newText.trim();
            });

            const count = matchingElements.length;

            if (newText.length === 0 || newText.length === 11) {
              event.target.textContent = initialText;
              return;
            } else {
              if (count < 2) {
                // Виводимо початковий та новий текст в консоль
                console.log('Початковий текст:', initialText);
                console.log('Новий текст:', newText);

                findInterestingTexts(initialText, newText);
                findInterestingTexts1(initialText, newText);

                event.target.textContent = newText;
                initialText = newText;
                //element.textContent(newText);
              } else {
                event.target.textContent = initialText;
              }
            }
          });
        });
      }
      else {
        // Створюємо вміст новой стрічки товару
        /*const productContent = `
          <h3 class="product-name" contenteditable="true" textDecoration ="line-through">${productName}</h3>
          <section class="counter">
            <button class="round-button-red disabled-round-button-red" data-tooltip="Мінус">-</button>
            <div class="count-display">${count}</div>
            <button class="round-button-green" data-tooltip="Плюс">+</button>
          </section>
          <section class="buy-section">
            <button class="button-bought" data-tooltip="Куплено">Куплено</button>
            <button class="button-square" data-tooltip="Видалити товар">✕</button>
          </section>
        `;*/

      let productContent = '';
      if (count == 1) {
        // Створюємо вміст новой стрічки товару
        productContent = `
          <h3 class="product-name" contenteditable="false">${productName.trim()}</h3>
          <section class="counter">
            <button class="round-button-red disabled-round-button-red" data-tooltip="Мінус">-</button>
            <div class="count-display">${count}</div>
            <button class="round-button-green" data-tooltip="Плюс">+</button>
          </section>
          <section class="buy-section">
            <button class="button-bought" data-tooltip="Куплено">Куплено</button>
            <button class="button-square" data-tooltip="Видалити товар">✕</button>
          </section>
        `;
      }
      else {
        // Створюємо вміст новой стрічки товару
        productContent = `
          <h3 class="product-name" contenteditable="false">${productName.trim()}</h3>
          <section class="counter">
            <button class="round-button-red" data-tooltip="Мінус">-</button>
            <div class="count-display">${count}</div>
            <button class="round-button-green" data-tooltip="Плюс">+</button>
          </section>
          <section class="buy-section">
            <button class="button-bought" data-tooltip="Куплено">Куплено</button>
            <button class="button-square" data-tooltip="Видалити товар">✕</button>
          </section>
        `;
      }

        // Встановлюємо вміст нового елемента
        newProduct.innerHTML = productContent;

        // Додаємо нову стрічку товару в батьківский елемент
        productSection.appendChild(newProduct);

        // Також додаємо новий товар в область "Залишилось"
        const remainingProduct = document.createElement('section');
        remainingProduct.className = 'product-icon';
        remainingProduct.innerHTML = `
          <span class="icon-product-name-bought">${productName.trim()}</span>
          <div class="icon-product-quantity-bought">${count}</div>
        `;
        boughtProductsSection.appendChild(remainingProduct);







        // Закреслюємо текст назви товару в лівому блоці
        newProduct.querySelector('.product-name').style.textDecoration = 'line-through';

        // Ховаємо кнопку "Куплено"
        newProduct.querySelector('.button-bought').style.display = 'none';

        // Ховаємо кнопку "Видалити товар"
        newProduct.querySelector('.button-square').style.display = 'none';

        // Ховаємо кнопки "+" и "-"
        newProduct.querySelector('.round-button-green').style.display = 'none';
        newProduct.querySelector('.round-button-red').style.display = 'none';

        // Показуємо кнопку "Не куплено"
        const buttonNotBought = document.createElement('button');
        buttonNotBought.className = 'button-not-bought';
        buttonNotBought.textContent = 'Не куплено';
        buttonNotBought.dataset.tooltip = 'Не куплено';
        newProduct.querySelector('.buy-section').appendChild(buttonNotBought);










        // В блоці відбувається оновлення списку елементів, на які ставиться слухач зміни назви
        const editableElements = newProduct.querySelectorAll('.product-name');

        // Перебрати кожен елемент
        editableElements.forEach(element => {
          let initialText; // Змінна для початкового тексту

          // Додаємо обробник кліку
          element.addEventListener('click', function (event) {
            // Оновлюємо значення змінної з початковим текстом
            initialText = event.target.textContent;
          });

          // Додати обробник події input
      element.addEventListener('input', function (event) {
        // Отримуємо новий текст після змін
        //const newText = event.target.textContent;
        let newText = event.target.textContent;

        // Перевіряємо, чи є вже такий товар в списку
        /*var existingProduct = Array.from(productSection.querySelectorAll('.product-name')).find(function (element) {
          return element.textContent === newText;
        });*/

        const matchingElements = Array.from(productSection.querySelectorAll('.product-name')).filter(function (element) {
          return element.textContent.trim() === newText.trim();
        });

        const count = matchingElements.length;
        console.log(count);        

        if (newText.length === 0 || newText.length === 11) {
          event.target.textContent = initialText;
          return;
        } else {
          //if (count < 2 && newText.trim() !== initialText) {
          if (count < 2) {
            // Виводимо початковий та новий текст в консоль
            console.log('Початковий текст:', initialText);
            console.log('Новий текст:', newText);

            findInterestingTexts(initialText, newText);
            findInterestingTexts1(initialText, newText);

            event.target.textContent = newText;
            initialText = newText;
            //element.textContent(newText);
          } else {
            event.target.textContent = initialText;
          }
        }
      });

      element.addEventListener('blur', function(event) {
        let newText = event.target.textContent;
        console.log(newText + ".");

        if (newText.trim() === initialText.trim()) {
          event.target.textContent = initialText.trim();
        }
      });
    });
    }
  }
}



















//Робочий варіант
function addProduct(productName) {
  // Перевіряємо, що поле "Назва товару" не пусте
  if (!productName || productName.trim() === '') {
    return; // Якщо поле пусте, виходимо з функції
  }

  // Перевіряємо, чи є вже такий товар в списку
  const existingProduct = Array.from(productSection.querySelectorAll('.product-name')).find(function (element) {
    return element.textContent === productName.trim();
  });

  if (existingProduct) {
    // Якщо товар вже є, збільшуємо його кількість на 1
    const countDisplay = existingProduct.parentElement.querySelector('.count-display');
    let count = parseInt(countDisplay.textContent);
    count++;
    countDisplay.textContent = count;

    // Оновлюємо стилі кнопки "-"
    const minusButton = existingProduct.parentElement.querySelector('.round-button-red');
    if (count === 1) {
      minusButton.classList.add('disabled-round-button-red');
      minusButton.classList.remove('round-button-red');
    } else {
      minusButton.classList.remove('disabled-round-button-red');
      minusButton.classList.add('round-button-red');
    }

    // Оновлюємо кількість товару в разділі "Залишилось"
    const remainingProducts = remainingProductsSection.querySelectorAll('.product-icon');
    const remainingProduct = Array.from(remainingProducts).find(function (element) {
      return element.querySelector('.icon-product-name').textContent === productName;
    });
    if (remainingProduct) {
      const remainingProductQuantity = remainingProduct.querySelector('.icon-product-quantity');
      remainingProductQuantity.textContent = count;
    }
  } else {
    // Якщо товару ще нема в списку, створюємо новий елемент

    // Створюємо новий елемент з класом "product"
    const newProduct = document.createElement('section');
    newProduct.className = 'product';

    // Створюємо вміст нової стрічки товару
    const productContent = `
      <h3 class="product-name" contenteditable="true">${productName.trim()}</h3>
      <section class="counter">
        <button class="round-button-red disabled-round-button-red" data-tooltip="Мінус">-</button>
        <div class="count-display">1</div>
        <button class="round-button-green" data-tooltip="Плюс">+</button>
      </section>
      <section class="buy-section">
        <button class="button-bought" data-tooltip="Куплено">Куплено</button>
        <button class="button-square" data-tooltip="Видалити товар">✕</button>
      </section>
    `;

    // Встановлюємо вміст нового елемента
    newProduct.innerHTML = productContent;

    // Додаємо нову стрічку товару в батьківський елемент
    productSection.appendChild(newProduct);

    // Також додаємо новий товар в область "Залишилось"
    const remainingProduct = document.createElement('section');
    remainingProduct.className = 'product-icon';
    remainingProduct.innerHTML = `
      <span class="icon-product-name">${productName.trim()}</span>
      <div class="icon-product-quantity">1</div>
    `;
    remainingProductsSection.appendChild(remainingProduct);

    // В блоці відбувається оновлення списку елементів, на які встановлюється слухач зміни назви
    const editableElements = newProduct.querySelectorAll('.product-name');

    // Перебрати кожен елемент
    editableElements.forEach(element => {
      let initialText; // Змінна для початкового тексту

      // Додаємо обробник кліку
      element.addEventListener('click', function (event) {
        // Оновлюємо значення змінної з початковим текстом
        initialText = event.target.textContent;
      });

      // Додати обробник події input
      element.addEventListener('input', function (event) {
        // Отримуємо новий текст після змін
        //const newText = event.target.textContent;
        let newText = event.target.textContent;

        // Перевіряємо, чи є вже такий товар в списку
        /*var existingProduct = Array.from(productSection.querySelectorAll('.product-name')).find(function (element) {
          return element.textContent === newText;
        });*/

        const matchingElements = Array.from(productSection.querySelectorAll('.product-name')).filter(function (element) {
          return element.textContent.trim() === newText.trim();
        });

        const count = matchingElements.length;
        console.log(count);        

        if (newText.length === 0 || newText.length === 11) {
          event.target.textContent = initialText;
          return;
        } else {
          //if (count < 2 && newText.trim() !== initialText) {
          if (count < 2) {
            // Виводимо початковий та новий текст в консоль
            console.log('Початковий текст:', initialText);
            console.log('Новий текст:', newText);

            findInterestingTexts(initialText, newText);
            findInterestingTexts1(initialText, newText);

            event.target.textContent = newText;
            initialText = newText;
            //element.textContent(newText);
          } else {
            event.target.textContent = initialText;
          }
        }
      });

      element.addEventListener('blur', function(event) {
        let newText = event.target.textContent;
        console.log(newText + ".");

        if (newText.trim() === initialText.trim()) {
          event.target.textContent = initialText.trim();
        }
      });
    });
  }
}

function findInterestingTexts(initialText, newText) {
  // Вибрати всі елементи з класом .product-icon
  const productIcons = document.querySelectorAll('.product-icon');

  // Створити масив для зберігання знайдених текстів
  const interestingTexts = [];

  // Перебрати кожен елемент с класом .product-icon
  productIcons.forEach(icon => {
    // Вибрати дочірні елементи с класом .product-icon-name
    //const iconNames = icon.querySelectorAll('.icon-product-name');
    let iconNames = icon.querySelectorAll('.icon-product-name');

    // Перебрати кожен елемент з класом .product-icon-name
    iconNames.forEach(name => {
      // Отримати текст елемента
      let text = name.textContent;

      // Перевірити, чи має текст фразу, потрібну фразу
      if (text === initialText.trim()) {
        name.textContent = newText.trim();
        // Додати текст в масив знайдених текстів
        interestingTexts.push(text);
      }
    });
  });

  console.log(interestingTexts);
  // Повернути знайдені тексти
  return interestingTexts;
}

function findInterestingTexts1(initialText, newText) {
  // Вибрати всі елементи з класом .product-icon
  const productIcons = document.querySelectorAll('.product-icon');

  // Створити масив для зберігання знайдених текстів
  const interestingTexts = [];

  // Перебрати кожен елемент з класом .product-icon
  productIcons.forEach(icon => {
    // Вибрати дочірні елементи з класом .product-icon-name-bought
    //const iconNames = icon.querySelectorAll('.icon-product-name-bought');
    let iconNames = icon.querySelectorAll('.icon-product-name-bought');

    // Перебрати кожен елемент з класом .product-icon-name-bought
    iconNames.forEach(name => {
      // Отримати текст елемента
      let text = name.textContent;

      // Перевірити, чи має текст фразу, потрібну фразу
      if (text === initialText.trim()) {
        name.textContent = newText.trim();
        // Додати текст в масив знайдених текстів
        //interestingTexts.push(text);
        interestingTexts.push(name.textContent);
      }
    });
  });

  console.log(interestingTexts);
  // Повернути знайдені тексти
  return interestingTexts;
}

//addProduct('Сир');
//addProduct('Помідор');
//addProduct('Печиво');

// Призначаємо обробник події при кліканні на кнопку "Додати товар"
addButton.addEventListener('click', function () {
  const productNameInput = document.getElementById('product-name');
  const productName = productNameInput.value;

  addProduct(productName);

  // Очищаємо поле "Назва товару" после додавання
  productNameInput.value = '';

  productNameInput.focus();
});


const productNameInput = document.getElementById('product-name');
productNameInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const productName = productNameInput.value;

    addProduct(productName);

    // Очищаємо поле "Назва товару" після додавання
    productNameInput.value = '';

    productNameInput.focus();
  }
});


//Не використовується
// Обробки події зміни назви товару в лівому блоці та розділі "Залишилось"
document.addEventListener('input', function (event) {
  if (event.target.classList.contains('product-name')) {
    // Отримуємо батьківский елемент стрічки товару
    const product = event.target.closest('.product');

    // Отримуємо поточне значення назви товару
    const newName = event.target.textContent.trim();

    // Отримуємо старе значення назви товару з атрибуту data-previous-name
    const previousName = event.target.dataset.previousName || '';

    // Якщо поточне ім'я товару не дорівнює попередній назві, виконуємо оновлення
    if (newName !== previousName) {
      // Оновлюємо назву товару в лівому блоці
      const productNameElement = product.querySelector('.product-name');
      productNameElement.textContent = newName;

      // Оновлюємо назву товару в розділі "Залишилось"
      const remainingProducts = remainingProductsSection.querySelectorAll('.product-icon');
      remainingProducts.forEach(function (remainingProduct) {
        const remainingProductNameElement = remainingProduct.querySelector('.icon-product-name');
        if (remainingProductNameElement.textContent.trim() === previousName) {
          remainingProductNameElement.textContent = newName;
        }
      });

      // Зберігаємо нове значення як попереднє ім'я товару
      event.target.dataset.previousName = newName;
    }
  }
});

// Обробник події для кнопки "Плюс"
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('round-button-green')) {
        // Отримуємо батьківський елемент стрічки товару
        const product = event.target.closest('.product');

        // Знаходимо елемент з кількістю товару
        const countDisplay = product.querySelector('.count-display');

        // Отримуємо поточне значення кількості товару
        let count = parseInt(countDisplay.textContent);

        // Збільшуємо кількість на 1
        count++;

        // Оновлюємо кількість товару
        countDisplay.textContent = count;

        // Оновлюємо кількість товару в розділі "Залишилось"
        const productName = product.querySelector('.product-name').textContent;
        const remainingProducts = remainingProductsSection.querySelectorAll('.product-icon');
        remainingProducts.forEach(function(remainingProduct) {
            const remainingProductName = remainingProduct.querySelector('.icon-product-name').textContent;
            if (remainingProductName === productName) {
                const remainingProductQuantity = remainingProduct.querySelector('.icon-product-quantity');
                remainingProductQuantity.textContent = count;
            }
        });

        // Оновлюємо стиль кнопки "-" в залежності від значения count
        const minusButton = product.querySelector('.round-button-red');
        if (count > 1) {
            minusButton.classList.remove('disabled-round-button-red');
        } else {
            minusButton.classList.add('disabled-round-button-red');
        }

    }
});

// Обробник події для кнопки "Мінус"
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('round-button-red')) {
        // Отримуємо батьківський елемент стрічки товару
        const product = event.target.closest('.product');

        // Знаходимо елемент з кількістю товару
        const countDisplay = product.querySelector('.count-display');

        // Отримуємо поточне значення кількості товару
        let count = parseInt(countDisplay.textContent);

        // Зменшуємо кількість на 1, але не менше 1
        count = Math.max(count - 1, 1);

        // Оновлюємо кількість товару
        countDisplay.textContent = count;

        // Перевіяємо умову для активності/неактивності кнопки "-"
        const minusButton = product.querySelector('.round-button-red');
        if (count === 1) {
            event.target.classList.add('disabled-round-button-red');
        } else {
            event.target.classList.remove('disabled-round-button-red');
        }

        // Оновлюємо кількість товару в розділі "Залишилось"
        const productName = product.querySelector('.product-name').textContent;
        const remainingProducts = remainingProductsSection.querySelectorAll('.product-icon');
        remainingProducts.forEach(function(remainingProduct) {
            const remainingProductName = remainingProduct.querySelector('.icon-product-name').textContent;
            if (remainingProductName === productName) {
                const remainingProductQuantity = remainingProduct.querySelector('.icon-product-quantity');
                remainingProductQuantity.textContent = count;
            }
        });
    }
});

// Обробник події для кнопки "Видалити товар"
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('button-square')) {
        // Отримуємо батьківський елемент кнопки "Видалити товар"
        const button = event.target;

        // Отримуємо батьківський елемент стрічки товару
        const product = button.closest('.product');

        if (product) {
            // Отримуємо назву товару
            const productName = product.querySelector('.product-name').textContent;

            // Знаходимо відповідний елемент в правому блоці за назвою товару
            const remainingProducts = remainingProductsSection.querySelectorAll('.product-icon');

            remainingProducts.forEach(function(remainingProduct) {
                const remainingProductName = remainingProduct.querySelector('.icon-product-name').textContent;
                if (remainingProductName === productName) {
                    // Якщо знаходимо відповідний елемент, видаляємо його
                    remainingProduct.remove();
                }
            });

            // Видаляємо стрічку товару із лівого блоку
            product.remove();

            // Очищаємо поле "Назва товару"
            //productNameInput.value = '';
        }
    }
});

// Обработчик события для кнопки "Куплено"
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('button-bought')) {
        // Отримуємо батьківський елемент стрічки товару
        const product = event.target.closest('.product');

        // Отримуємо елемент з назвою товару
        const productNameElement = product.querySelector('.product-name');

        // Переносимо тільки текст назви та кількість товару в розділ "Куплено"
        const boughtProductName = productNameElement.textContent;
        const boughtProductQuantity = product.querySelector('.count-display').textContent;

        // Створюємо новий елемент для переміщення в розділ "Куплено"
        const boughtProduct = document.createElement('section');
        boughtProduct.className = 'product-icon';

        // Створюємо вміст для нового елемента
        const boughtProductContent = `
            <span class="icon-product-name-bought">${boughtProductName}</span>
            <div class="icon-product-quantity-bought">${boughtProductQuantity}</div>
        `;

        // Встановлюємо вміст нового елемента
        boughtProduct.innerHTML = boughtProductContent;

        // Додаємо новий елемент в розділ "Куплено"
        boughtProductsSection.appendChild(boughtProduct);

        // Видаляємо елемент із розділу "Залишилось"
        const remainingProducts = remainingProductsSection.getElementsByClassName('product-icon');
        for (let i = 0; i < remainingProducts.length; i++) {
            const remainingProductName = remainingProducts[i].querySelector('.icon-product-name').textContent;
            if (remainingProductName === boughtProductName) {
                remainingProducts[i].remove();
                break;
            }
        }

        // Закреслюємо текст назви товару в лівому блоці
        productNameElement.style.textDecoration = 'line-through';
        productNameElement.contentEditable = 'false';

        // Ховаємо кнопку "Куплено"
        event.target.style.display = 'none';

        // Ховаємо кнопку "Видалити товар"
        product.querySelector('.button-square').style.display = 'none';

        // Ховаємо кнопки "+" и "-"
        product.querySelector('.round-button-green').style.display = 'none';
        product.querySelector('.round-button-red').style.display = 'none';

        // Показуємо кнопку "Не куплено"
        const buttonNotBought = document.createElement('button');
        buttonNotBought.className = 'button-not-bought';
        buttonNotBought.textContent = 'Не куплено';
        buttonNotBought.dataset.tooltip = 'Не куплено';
        product.querySelector('.buy-section').appendChild(buttonNotBought);
    }
});

// Обробник події для кнопки "Не куплено"
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('button-not-bought')) {
        // Отримуємо батьківський елемент стрічки товару
        const product = event.target.closest('.product');

        // Прибираємо закреслення з тексту назви товару
        product.querySelector('.product-name').style.textDecoration = 'none';
        product.querySelector('.product-name').contentEditable = 'true';

        // Ховаємо кнопку "Не куплено"
        event.target.style.display = 'none';

        // Показуємо кнопку "Видалити товар" с символом ✕
        product.querySelector('.button-square').style.display = 'inline-block';

        // Показуємо кнопку "Куплено"
        product.querySelector('.button-bought').style.display = 'inline-block';

        // Показуємо кнопки "+" и "-"
        product.querySelector('.round-button-green').style.display = 'inline-block';
        product.querySelector('.round-button-red').style.display = 'inline-block';

        // Отримуємо назву товару
        const productName = product.querySelector('.product-name').textContent;

        // Знаходимо відповідний елемент в розділі "Куплено" за назвою товару
        const boughtProducts = boughtProductsSection.querySelectorAll('.product-icon');

        boughtProducts.forEach(function(boughtProduct) {
            const boughtProductName = boughtProduct.querySelector('.icon-product-name-bought').textContent;
            if (boughtProductName === productName) {
                // Якщо знайдено відповідний елемент, видаляємо його
                boughtProduct.remove();
            }
        });

        // Додаємо новий елемент в розділ "Залишилось"
        const remainingProduct = document.createElement('section');
        remainingProduct.className = 'product-icon';
        remainingProduct.innerHTML = `
            <span class="icon-product-name">${productName}</span>
            <div class="icon-product-quantity">1</div>
        `;
        remainingProductsSection.appendChild(remainingProduct);

        // Оновлюємо кількість товару в розділі "Залишилося"
        const remainingProducts = remainingProductsSection.querySelectorAll('.product-icon');
        remainingProducts.forEach(function(remainingProduct) {
            const remainingProductName = remainingProduct.querySelector('.icon-product-name').textContent;
            if (remainingProductName === productName) {
                const count = parseInt(product.querySelector('.count-display').textContent);
                const remainingProductQuantity = remainingProduct.querySelector('.icon-product-quantity');
                remainingProductQuantity.textContent = count;
            }
        });

        // Очищаємо поле "Назва товару"
        //productNameInput.value = '';
    }
});


































