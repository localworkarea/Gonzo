// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";



document.addEventListener("DOMContentLoaded", function() {
  
  const splitTextLines = document.querySelectorAll('.split-lines');
  const splitTextWords = document.querySelectorAll('.split-words');
  const splitTextBoth = document.querySelectorAll('.split-both');
  
  if (splitTextLines.length > 0) {
    splitTextLines.forEach(element => {
      const splitText = new SplitType(element, { types: 'lines' });
  
      window.addEventListener("resize", function() {
        splitText.split();
      });
    });
  }
  
  if (splitTextWords.length > 0) {
    splitTextWords.forEach(element => {
      const splitText = new SplitType(element, { types: 'words' });
  
      window.addEventListener("resize", function() {
        splitText.split();
      });
    });
  }
  if (splitTextBoth.length > 0) {
    splitTextBoth.forEach(element => {
      const splitText = new SplitType(element, { types: 'lines, words' });
      
      window.addEventListener("resize", function() {
        splitText.split();
      });
    });
  }

   // Функция для обновления индексов и расстановки их заново
  function updateIndexes() {
    
    splitTextBoth.forEach((splitElement) => {
      const words = splitElement.querySelectorAll('.word');
      
      words.forEach((word, index) => {
        word.style.setProperty('--index', index);
      });
    });
    splitTextLines.forEach((splitElement) => {
      const words = splitElement.querySelectorAll('.word');
      
      words.forEach((word, index) => {
        word.style.setProperty('--index', index);
      });
    });

  }
  
  if (splitTextBoth || splitTextLines) {
    updateIndexes();
  }



    // ==   VIDEO YOUTUBE ON CLICK BUTTON ==================================================
    const videoYoutubeButtons = document.querySelectorAll('.video-youtube__button');
    videoYoutubeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const youTubeCode = this.getAttribute('data-youtube');
            let autoplay = true; // Автоплей разрешено (true) или нет (false)
    
            let urlVideo = `https://www.youtube.com/embed/${youTubeCode}?rel=0&showinfo=0`;
    
            const iframe = document.createElement('iframe');
            iframe.setAttribute('allowfullscreen', '');
    
            if (autoplay) {
                urlVideo += '&autoplay=1';
                iframe.setAttribute('allow', 'autoplay; encrypted-media');
            }
    
            iframe.setAttribute('src', urlVideo);
    
            const body = this.closest('.video-youtube__body');
            body.innerHTML = '';
            body.appendChild(iframe);
            body.classList.add('video-added');
        });
    });
    // =====================================================================================
  
  

  // == TEST PAGE ================================================================
  const sections = document.querySelectorAll('.form__section');
  const testContainer = document.querySelector('.test__container');
  let currentSection = 0;
  let data = {};

  fetch('files/data.json')
    .then(response => response.json())
    .then(json => data = json)
    .catch(error => console.error('Error fetching data:', error));

  if (sections.length) {
    sections[currentSection].classList.add('_active');

    sections.forEach((section, index) => {
      const options = section.querySelectorAll('.options__input');
      const button = section.querySelector('.form__btn');

      options.forEach(option => {
        option.addEventListener('change', () => {
          button.classList.add('_next');
        });
      });

      button.addEventListener('click', () => {
        if (button.classList.contains('_next')) {
          sections[currentSection].classList.remove('_active');
          currentSection++;

          if (currentSection < sections.length) {
            sections[currentSection].classList.add('_active');
          } else {
            testContainer.classList.add('_show-result');
            formSubmit();
          }
        }
      });
    });
  }

  function formSubmit() {
    const forms = document.forms;
    if (forms.length) {
      for (const form of forms) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          formSubmitAction(form);
        });
      }
    }

    function formSubmitAction(form) {
      const formData = new FormData(form);
      const selectedAnswers = [];
      formData.forEach((value) => {
        selectedAnswers.push(value);
      });

      const groupCounts = selectedAnswers.reduce((acc, answer) => {
        acc[answer] = (acc[answer] || 0) + 1;
        return acc;
      }, {});

      const groupA = groupCounts['answer1_1'] || 0;
      const groupB = groupCounts['answer1_2'] || 0;
      const groupC = groupCounts['answer1_3'] || 0;

      let selectedGroup;
      if (groupA > groupB && groupA > groupC) {
        selectedGroup = 'groupA';
      } else if (groupB > groupA && groupB > groupC) {
        selectedGroup = 'groupB';
      } else if (groupC > groupA && groupC > groupB) {
        selectedGroup = 'groupC';
      } else {
        const groups = ['groupA', 'groupB', 'groupC'];
        selectedGroup = groups[Math.floor(Math.random() * groups.length)];
      }

      console.log(`Selected Group: ${selectedGroup}`);
      updateResult(selectedGroup); // Update the result section
      formSent(form, selectedGroup);
    }

    function formSent(form, selectedGroup) {
      document.dispatchEvent(new CustomEvent("formSent", {
        detail: {
          form: form,
          group: selectedGroup
        }
      }));
    }
  }

  function updateResult(group) {
    const result = data[group];
    if (result) {
      document.querySelector('.result__name span').innerText = result.name;
      document.querySelector('.p-01').innerText = result.description;
      document.querySelector('.p-02').innerHTML = result.taste;
      document.querySelector('.result__pack').src = result.image;
    } else {
      console.error('Group data not found');
    }
  }
  // ==========================================================================

   // Функция для копирования текста в буфер обмена =========================
  const copyButton = document.querySelector('.result__copy');
  const resultLink = document.querySelector('.result__link');
  const resultNameElement = document.querySelector('.result__name span');
  const copyWrapper = document.querySelector('.result__copy-wr');
  const textCopiedElement = document.querySelector('.text-copied');

  if (copyButton) {
    function copyToClipboard(text) {
      // Создаем textarea
      const tempTextarea = document.createElement('textarea');
      tempTextarea.readOnly = true;
      tempTextarea.value = text;
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      tempTextarea.setSelectionRange(0, text.length);
      document.execCommand('copy');
      document.body.removeChild(tempTextarea); 
    }

    copyButton.addEventListener('click', () => {
      const resultText = resultNameElement.textContent;
      const textToCopy = `Я ${resultText}`;
      copyToClipboard(textToCopy);

      copyWrapper.classList.add('_copied');
      resultLink.classList.add('_copied');
      if (textCopiedElement) {
        textCopiedElement.classList.add('_show');

        setTimeout(() => {
          textCopiedElement.classList.remove('_show');
        }, 800);
      }
    });
  }

 // ===================================================================================


});
