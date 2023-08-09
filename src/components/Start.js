import { logOutUser } from '../lib/account';
import { bringPost, updatePost, removePost } from '../lib/post';
import { bottomMenu2, titleBox2 } from './htmlElements';

export const Start = (navigateTo) => {
  const homeDiv = document.createElement('div');

  const loginError = document.createElement('h5');
  loginError.innerText = '';

  const containerPosts = document.createElement('div');
  containerPosts.classList.add('post-area');
  document.createElement('container', containerPosts);

  // buttonLogout.setAttribute('id', 'botoncito');

  bringPost().then((res) => {
    res.forEach((doc) => {
      const p = doc.data();
      const postElement = document.createElement('p');
      postElement.textContent = p.post;
      containerPosts.appendChild(postElement);

      const editButton = document.createElement('button');
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

        const popup = createEditPopup(p.post);

        const saveButton = popup.querySelector('.popup-save');
        saveButton.addEventListener('click', () => {
          const newPostContent = popup.querySelector('.popup-input').value;
          postElement.textContent = newPostContent;
          const newData = {
            post: newPostContent,
          };
          if (p.id) {
            updatePost(p.id, newData);
          }
          popup.remove();
        });

        const cancelButton = popup.querySelector('.popup-cancel');
        cancelButton.addEventListener('click', () => {
          popup.remove();
        });
        containerPosts.appendChild(popup);
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Deleted';
      deleteButton.addEventListener('click', () => {
        if (doc.id) {
          removePost(doc.id);
        }
      });

      containerPosts.appendChild(editButton);
      containerPosts.appendChild(deleteButton);
    });
  });

  homeDiv.append(titleBox2());
  homeDiv.appendChild(containerPosts);
  homeDiv.append(bottomMenu2(navigateTo, logOutUser));

  return homeDiv;
};
