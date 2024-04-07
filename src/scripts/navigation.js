class Navigation {
  // Create Nav element and append it to the body
  create = () => {
    const nav = document.createElement('nav');

    setAttributes(nav, {
      'id' : 'nav',
      'aria-label' : 'cities',
    });
    document.body.append(nav);
  }

  // Use array data to create elements as an unordered list in the nav
  createElements = (data) => {
    // return if data is invalid
    if (!data) return;

    let nav = document.querySelector('nav');
    let navList = document.createElement('ul');

    setAttributes(navList, {
      'id' : 'nav-list',
      'class': 'nav-list',
    })

    // Append the unordered list to the nav
    nav.append(navList);

    // Loop through the array and create an element for list item entry for each array
    data?.map(({ section, label }, i) => {
      let listItem = document.createElement('li');
      let button = document.createElement('button');

      listItem.append(button);
      navList.append(listItem);

      // We want to set the first item to be selected by default
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
  // Create the clock element
  create = () => {
    let clock = document.createElement('div');

    setAttributes(clock, {
      'id' : 'clock',
      'class': 'clock',
    });

    document.body.append(clock);
  }
}

// Fetch data from the JSON file
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

// Helper function to set multiple attributes at once
const setAttributes = (el, attrs) => {
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

// Animation function for the underline
const animation = () => {
  let navList = document.getElementById('nav-list');
  let activeEl = document.querySelector('[aria-selected="true"]');

  // Underline positioning property values. We want to set underline to the size of the button width
  navList.style.setProperty('--offset-left', `${activeEl.offsetLeft}px`);
  navList.style.setProperty('--button-width', `${activeEl.offsetWidth}px`);
}

// On Click handler 
const onClickHandler = (event, data) => {
  event.preventDefault();

  // Get the active element
  let activeEl = document.querySelector('[aria-selected="true"]');
  let newActiveEl = event.target;

  // Set the currently selected active element to false, and newly selected active element to true
  activeEl.setAttribute('aria-selected', false);
  newActiveEl.setAttribute('aria-selected', true);

  // Update timezone to the newly selected element
  setTime(data);

  requestAnimationFrame(animation);
}

// Set time to the currently selected timezone
const setTime = async (data) => {
  // Get the current active element, and find it within the data
  let activeEl = document.querySelector('[aria-selected="true"]');
  let city = data.find((city) => (city.section === activeEl.dataset.section));

  let currentTime = new Date().toLocaleString([], {timeZone: city.tz});
  let clock = document.getElementById('clock');

  clock.innerHTML = currentTime;
}

// Init function that runs on page load
const init = async () => {
  let nav = new Navigation();
  let clock = new Clock();

  let data = await getData();

  // Create the nav, nav elements and clock element
  nav.create();
  clock.create();
  nav.createElements(data?.cities)
  
  requestAnimationFrame(animation);

  // On resize, animate  (updates underline offset and width)
  window.addEventListener('resize', () => {
    requestAnimationFrame(animation);
  });

  // Initialize the time
  setTime(data?.cities);

  // Update time every second
  setInterval(() => {
    setTime(data?.cities);
  }, 1000)
}

init();