import { onSnapshot } from 'firebase/firestore';
import { updatePost, removePost, q } from '../lib/post';
import { getCurrentUser } from '../lib/account';

const likedPostsNew = {};
function userLikedPost(postId) {
  const userId = getCurrentUser().uid;
  return likedPostsNew[postId]?.includes(userId);
}

const postRender = () => {
  const div = document.createElement('div');
  div.classList = 'postReal';
  onSnapshot(q, (querySnapshot) => {
    document.querySelector('.postReal').innerHTML = '';
    querySnapshot.forEach((doc) => {
      const postCard = document.createElement('div');
      postCard.classList = 'postCard';

      const postElement = document.createElement('p');
      postElement.textContent = doc.data().post;

      const numberLikes = document.createElement('span');
      numberLikes.textContent = ' '+ doc.data().like + '♥';

      const likeButton = document.createElement('button');
      likeButton.innerHTML = '<i class="fa-solid fa-heart"></i>';

      function updateLikeButtonState() {
        if (userLikedPost(doc.id)) {
          likeButton.classList.add('liked');
        } else {
          likeButton.classList.remove('liked');
        }
      }
      updateLikeButtonState();
      // aqui va validacion
      likeButton.addEventListener('click', () => {
        if (!userLikedPost(doc.id)) {
          likedPostsNew[doc.id] = likedPostsNew[doc.id] || [];
          likedPostsNew[doc.id].push(getCurrentUser().uid);

          const newData = {
            like: doc.data().like + 1,
            likeUser: likedPostsNew[doc.id],
          };

          updatePost(doc.id, newData);
          updateLikeButtonState();
        }
      });

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
        const popup = createEditPopup(doc.data().post);

        const saveButton = popup.querySelector('.popup-save');
        saveButton.addEventListener('click', () => {
          const newPostContent = popup.querySelector('.popup-input').value;
          postElement.textContent = newPostContent;
          const newData = {
            post: newPostContent,
          };
          if (doc.data().id) {
            updatePost(doc.data().id, newData);
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
        if (doc.id) {
          removePost(doc.id);
        }
      });

      postElement.appendChild(numberLikes);
      postCard.appendChild(postElement);
      postCard.appendChild(likeButton);
      postCard.appendChild(deleteButton);
      postCard.appendChild(editButton);
      div.appendChild(postCard);
    });
  });

  return div;
};
export default postRender;
