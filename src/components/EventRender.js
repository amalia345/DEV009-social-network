import { onSnapshot } from 'firebase/firestore';
import { updateEvent, removeEvent, q } from '../lib/events';

const containerEvents = document.createElement('div');
containerEvents.classList.add('event-area');
document.createElement('container', containerEvents);

const eventRender = () => {
  const div = document.createElement('div');
  div.classList = 'tiemporeal';
  onSnapshot(q, (querySnapshot) => {
    document.querySelector('.tiemporeal').innerHTML = '';
    querySnapshot.forEach((ev) => {
      const elementCard = document.createElement('div');
      elementCard.classList = 'elementCard';

      const postElement = document.createElement('p');
      postElement.textContent = ev.data().post;

      const editButton = document.createElement('button');
      editButton.id = 'editbuttonid';
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        function createEditPopup(initialValue) {
          const popup = document.createElement('div');
          popup.classList.add('popup');

          const input = document.createElement('input');
          input.classList.add('popup-input');
          input.value = initialValue;

          const saveButton = document.createElement('button');
          saveButton.classList.add('popup-save');
          saveButton.textContent = 'Save';

          const cancelButton = document.createElement('button');
          cancelButton.classList.add('popup-cancel');
          cancelButton.textContent = 'Cancel';

          popup.appendChild(input);
          popup.appendChild(saveButton);
          popup.appendChild(cancelButton);

          return popup;
        }

        const popup = createEditPopup(ev.data().post);

        const saveButton = popup.querySelector('.popup-save');
        saveButton.addEventListener('click', () => {
          const newPostContent = popup.querySelector('.popup-input').value;
          postElement.textContent = newPostContent;
          const newData = {
            post: newPostContent,
          };
          if (ev.id) {
            updateEvent(ev.id, newData);
          }
          popup.remove();
        });

        const cancelButton = popup.querySelector('.popup-cancel');
        cancelButton.addEventListener('click', () => {
          popup.remove();
        });

        postElement.appendChild(popup);
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        if (ev.id) {
          removeEvent(ev.id);
        }
      });

      elementCard.appendChild(postElement);
      elementCard.appendChild(deleteButton);
      elementCard.appendChild(editButton);
      div.appendChild(elementCard);
      /* div.appendChild(postElement);
      div.appendChild(deleteButton);
      div.appendChild(editButton);
      div.appendChild(elementCard); */
    });
  });
  return div;
};
export default eventRender;
