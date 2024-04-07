class Navigation {
  create = () => {
    const nav = document.createElement('nav');

    setAttributes(nav, {
      'id' : 'nav',
      'aria-label' : 'cities',
    });
    document.body.append(nav);
  }

  createElements = (data) => {
    if (!data) return;

    let nav = document.querySelector('nav');
    let navList = document.createElement('ul');

    setAttributes(navList, {
      'id' : 'nav-list',
      'class': 'nav-list',
    })

    nav.append(navList);

    data?.map(({ section, label }, i) => {
      let listItem = document.createElement('li');
      let button = document.createElement('button');

      listItem.append(button);
      navList.append(listItem);

      setAttributes(button, {
        'data-section' : section,
        'aria-labelledby' : section,
        'aria-selected' : i === 0 ? true : false,
      })

      button.innerHTML = label;
      button.addEventListener('click', (event) => onClickHandler(event, data));
    })
  }
}

class Clock {
  create = () => {
    let clock = document.createElement('div');

    setAttributes(clock, {
      'id' : 'clock',
      'class': 'clock',
    });

    document.body.append(clock);
  }
}

const getData = async () => {
  let data = await fetch("data/navigation.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error
          (`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
    .then((data) => {
      return data;
    })
    .catch((error) => 
      console.error("Unable to fetch data:", error));
  return data;
}

const setAttributes = (el, attrs) => {
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

const onClickHandler = (event, data) => {
  event.preventDefault();

  // Get the active element
  let activeEl = document.querySelector('[aria-selected="true"]');
  let newActiveEl = event.target;

  activeEl.setAttribute('aria-selected', false);
  newActiveEl.setAttribute('aria-selected', true);

  setTime(data);

  requestAnimationFrame(animation);
}

const animation = () => {
  let navList = document.getElementById('nav-list');
  let activeEl = document.querySelector('[aria-selected="true"]');

  navList.style.setProperty('--offset-left', `${activeEl.offsetLeft}px`);
  navList.style.setProperty('--button-width', `${activeEl.offsetWidth}px`);
}

const setTime = async (data) => {
  let activeEl = document.querySelector('[aria-selected="true"]');
  let city = data.find((city) => (city.section === activeEl.dataset.section));

  let currentTime = new Date().toLocaleString([], {timeZone: city.tz});
  let clock = document.getElementById('clock');

  clock.innerHTML = currentTime;
}

const init = async () => {
  let nav = new Navigation();
  let clock = new Clock();

  let data = await getData();

  nav.create();
  clock.create();
  nav.createElements(data?.cities)
  
  requestAnimationFrame(animation);

  window.addEventListener('resize', () => {
    requestAnimationFrame(animation);
  });

  setTime(data?.cities);

  setInterval(() => {
    setTime(data?.cities);
  }, 1000)
}

init();