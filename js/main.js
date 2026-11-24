// 1. АККОРДЕОН ПРОГРАММЫ ОБУЧЕНИЯ
// Находим все кнопки заголовков уровней (.accordion__header) и вешаем на каждую обработчик клика
document.querySelectorAll(".accordion__header").forEach((button) => {
  button.addEventListener("click", () => {
    // Ищем ближайший родительский блок пункта аккордеона (.accordion__item)
    const item = button.closest(".accordion__item");

    // Переключаем класс открытия: если был — убираем, если не было — добавляем.
    // isOpen хранит true (если блок стал открыт) или false (если закрылся)
    const isOpen = item.classList.toggle("accordion__item--open");

    // Обновляем атрибут aria-expanded ("true"/"false") для доступности (скринридеры и клавиатура
    // понимают, раскрыт сейчас пункт программы или свёрнут)
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

// 2. КНОПКА ПРОКРУТКИ НАВЕРХ
// Ищем кнопку .scroll-top на странице
const scrollTopBtn = document.querySelector(".scroll-top");

// Проверяем, что кнопка действительно есть на странице (чтобы не было ошибки, если её удалят из HTML)
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    // Плавно прокручиваем окно браузера в самую верхнюю точку (top: 0)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// 3. ПЛАВНЫЙ ПЕРЕХОД К ФОРМЕ ЗАЯВКИ ПО КНОПКЕ «ЗАПИСАТЬСЯ»
const enrollBtn = document.querySelector(".cta-button");
const applicationSection = document.getElementById("application-form");

// Запускаем логику только если найдены и кнопка, и сама секция формы
if (enrollBtn && applicationSection) {
  enrollBtn.addEventListener("click", () => {
    // Плавно прокручиваем страницу так, чтобы верх секции заявки встал у начала экрана
    // (учитывая scroll-margin-top из CSS, чтобы блок не заехал под шапку)
    applicationSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

// 4. ПЛАВНОЕ ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ ПРОКРУТКЕ СТРАНИЦЫ
// Выбираем все секции ниже первого экрана, которые должны плавно проявляться
const sectionsToReveal = document.querySelectorAll(
  ".about-course, .skills, .program, .teachers, .project-work, .application",
);

if (sectionsToReveal.length > 0) {
  // Проверяем системную настройку пользователя: не попросил ли он уменьшить/отключить анимации
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Анимируем только если анимации не отключены и браузер поддерживает IntersectionObserver
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    // Скрываем секции в исходное состояние (через CSS-класс .reveal-on-scroll),
    // чтобы они плавно проявились, когда до них дойдёт прокрутка
    sectionsToReveal.forEach((section) => {
      section.classList.add("reveal-on-scroll");
    });

    // Создаём наблюдатель: он следит, когда элемент попадает в видимую область экрана
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          // entry.isIntersecting становится true, когда секция вошла в область видимости
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            // Анимируем секцию только один раз и прекращаем за ней следить
            obs.unobserve(entry.target);
          }
        });
      },
      {
        // Срабатывает, когда видно хотя бы 12% высоты секции
        threshold: 0.12,
        // Слегка сдвигаем нижнюю границу зоны срабатывания вверх на 40px,
        // чтобы появление ощущалось естественнее
        rootMargin: "0px 0px -40px 0px",
      },
    );

    // Подключаем наблюдатель ко всем выбранным секциям
    sectionsToReveal.forEach((section) => {
      observer.observe(section);
    });
  } else {
    // Если пользователь отключил анимации или браузер старый — сразу показываем все секции
    sectionsToReveal.forEach((section) => {
      section.classList.add("is-visible");
    });
  }
}

// 5. ВЫПАДАЮЩЕЕ МЕНЮ (БУРГЕР) ДЛЯ ПЛАНШЕТОВ И ТЕЛЕФОНОВ
const burgerBtn = document.querySelector(".burger-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener("click", () => {
    // Переключаем состояние открытия у кнопки и у выпадающего меню
    const isOpen = burgerBtn.classList.toggle("is-open");
    mobileMenu.classList.toggle("is-open", isOpen);

    // Обновляем aria-expanded для доступности
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Если пользователь расширил окно обратно до десктопа — закрываем мобильное меню,
  // чтобы оно не осталось висеть открытым при смене ориентации/размера экрана
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && mobileMenu.classList.contains("is-open")) {
      burgerBtn.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
      burgerBtn.setAttribute("aria-expanded", "false");
    }
  });
}