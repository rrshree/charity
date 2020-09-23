const sectionsContainer = document.querySelector('.page-sections');
const sections = document.querySelectorAll('.page-section');
const nav = document.querySelector('.nav-sections');
const menu = nav.querySelector('.menu');
const links = nav.querySelectorAll('.menu-item-link');
const activeLine = nav.querySelector('.active-line');
const sectionOffset = nav.offsetHeight + 24;
const activeClass = 'active';
//initial state
let activeIndex = 0;
let isScrolling = true;
let userScroll = true;

//set/remove active class
const setActiveClass = () => {
	links[activeIndex].classList.add(activeClass);
};

const removeActiveClass = () => {
	links[activeIndex].classList.remove(activeClass);
};

// Transform active state and set smooth scroll
const moveActiveLine = () => {
	const link = links[activeIndex];
	const linkX = link.getBoundingClientRect().x;
	const menuX = menu.getBoundingClientRect().x;

	activeLine.style.transform = `translateX(${
		menu.scrollLeft - menuX + linkX
	}px)`;
	activeLine.style.width = `${link.offsetWidth}px`;
};

const setMenuLeftPosition = (position) => {
	menu.scrollTo({
		left: position,
		behavior: 'smooth',
	});
};

//menu overdlow checks!
const checkMenuOverflow = () => {
	const activeLink = links[activeIndex].getBoundingClientRect();
	const offset = 30;

	if (Math.floor(activeLink.right) > window.innerWidth) {
		setMenuLeftPosition(
			menu.scrollLeft + activeLink.right - window.innerWidth + offset
		);
	} else if (activeLink.left < 0) {
		setMenuLeftPosition(menu.scrollLeft + activeLink.left - offset);
	}
};

const handleActiveLinkUpdate = (current) => {
	removeActiveClass();
	activeIndex = current;
	checkMenuOverflow();
	setActiveClass();
	moveActiveLine();
};

//page load
const init = () => {
	moveActiveLine(links[0]);
	document.documentElement.style.setProperty('--section-offset', sectionOffset);
};

links.forEach((link, index) =>
	link.addEventListener('click', () => {
		userScroll = false;
		handleActiveLinkUpdate(index);
	})
);

(function (a) {
	var b = 0,
		c = a(window),
		e = a('.semplice-navbar');
	c.on('scroll', function () {
		var d = c.scrollTop();
		e.toggleClass('hide-navbar', d > b);
		b = d;
	});
	a(window).scroll(function () {
		300 >= a(this).scrollTop() &&
			a('.semplice-navbar').removeClass('hide-navbar');
	});
});

window.addEventListener('scroll', () => {
	const currentIndex =
		sectionsContainer.getBoundingClientRect().top < 0
			? sections.length -
			  1 -
			  [...sections]
					.reverse()
					.findIndex(
						(section) => window.scrollY >= section.offsetTop - sectionOffset * 2
					)
			: 0;

	if (userScroll && activeIndex !== currentIndex) {
		handleActiveLinkUpdate(currentIndex);
	} else {
		window.clearTimeout(isScrolling);
		isScrolling = setTimeout(() => (userScroll = true), 100);
	}
});

init();
