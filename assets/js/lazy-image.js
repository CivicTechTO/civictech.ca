async function lazyImg() {
  if (window.location.pathname !== '/hacknights/') return;
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length === 0) return;

  // this file should be generated by _scripts/img.sh
  // it looks like:
  // {
  //   "image1.jpg": "300,200",
  //   "image2.jpg": "400,300"
  // }
  let dimensionsList = {};

  try {
    const fetchedDimensionsList = await fetch(
      '/assets/images/hacknights/thumbnails/thumbs.json'
    ).then((response) => response.json());
    dimensionsList = fetchedDimensionsList;
  } catch (error) {
    console.warn('Failed to fetch image dimensions list');
  }

  const observerOptions = {
    rootMargin: '0px',
    threshold: 0.1,
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const imgTag = entry.target;
      const src = imgTag.dataset.src;
      if (!src) return;

      // try to set width and height at the beginning,
      // so that the image container has a size before the image is loaded
      // and we can avoid layout shifts
      const imageName = src.split('/').pop();
      const dimensions = dimensionsList[imageName]
        ? dimensionsList[imageName].split(',')
        : [300, 300];
      imgTag.parentElement.style.width = `${dimensions[0]}px`;
      imgTag.parentElement.style.height = `${dimensions[1]}px`;

      // when the image is in view, load it and show it
      if (entry.isIntersecting && imgTag.dataset.src) {
        imgTag.removeAttribute('data-src');

        setTimeout(() => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            imgTag.src = img.src;
            imgTag.classList.add('show');
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
          };
        }, 0);
      }
    });
  }, observerOptions);

  lazyImages.forEach((img) => {
    observer.observe(img);
  });
}

lazyImg();
