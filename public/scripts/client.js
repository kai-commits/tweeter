const MAX_TWITTER_CHAR_COUNT = 140;

// Using data-tags instead of accessing classes directly.
// This allows me to alter css classes without ruining the js functionality
// and also keep track of which html elements have functionality tied to them.
const dataTags = {
  input: '[data-id=tweet-input]',
  counter: '[data-id=tweet-count]',
  form: '[data-id=tweet-form]',
  nav: '[data-id=nav-data]',
  container: '[data-id=tweet-container]',
  error: '[data-id=toast-error]',
  errorClose: '[data-id=error-close]',
  navTweet: '[data-id=nav-tweet]',
  newTweet: '[data-id=new-tweet]',
  arrow: '[data-id=arrow-icon]',
};

$(() => { // Makes sure document is ready.
  $(dataTags.form).on('submit', function(event) { // Event when 'tweet' button is clicked.
    event.preventDefault();
    if ($(dataTags.input).val() === '') {
      return showToastError(toastError("Tweet cannot be empty!"));
    }
    if ($(dataTags.counter).val() < 0) {
      return showToastError(toastError(`Tweet cannot exceed ${MAX_TWITTER_CHAR_COUNT} characters!`));
    }
    $.ajax('/tweets', { 
      method: 'POST',
      data: $(this).serialize()
    })
    .then(() => {
      loadTweets();
    });
  });

  $(dataTags.navTweet).on('click', function() { // Event when 'Write new tweet' is clicked.
    $(dataTags.newTweet).slideToggle();
    $(dataTags.arrow).toggleClass('rotate'); // Calls '.rotate' css class which rotates the red arrow icon 180 deg.
    $(dataTags.input).focus();
  });

  const loadTweets = () => {
    $.ajax('/tweets', {
      method: 'GET'
    })
    .then((res) => {
      $(dataTags.input).val(''); // Resets values to default
      $(dataTags.counter).val(MAX_TWITTER_CHAR_COUNT);
      $(dataTags.container).empty();
      renderTweets(res);
    });
  };
  loadTweets();
});

const createTweetElement = (tweetData) => { // Dynamically creates new tweets from template.
  return $(`
  <article class="tweet">
    <header class="profile">
      <div class="picture-name">
        <img class="picture" src="${escape(tweetData.user.avatars)}"/>
        <div class="name">${escape(tweetData.user.name)}</div>
      </div>
      <div class="tweeter-handle">${escape(tweetData.user.handle)}</div>
    </header>
    <div class="tweet-body">${escape(tweetData.content.text)}</div>
    <footer class="tweet-footer">
      <div class="tweet-age">${escape(timeago.format(tweetData.created_at))}</div>
      <div class="tweet-actions">
        <i class="fa-solid fa-flag"></i>
        <i class="fa-solid fa-retweet"></i>
        <i class="fa-solid fa-heart"></i>
      </div>
    </footer>
  </article>
  `);
};

const renderTweets = (data) => {
  for (let tweet of data) {
    $(dataTags.container).prepend(createTweetElement(tweet));
  }
};

const toastError = (errorMessage) => { // Creates error message template.
  return $(`
  <section class="toast-error" data-id="toast-error">
    <i class="fa-solid fa-circle-exclamation toast-content" id="error-icon"></i>
    <div class="error-message toast-content"><strong>Error: </strong>${errorMessage}</div>
    <i class="fa-solid fa-xmark toast-content" id="error-close" data-id="error-close"></i>
  </section>
  `);
};

const showToastError = (toastError) => {
  if ($(dataTags.error).length > 0) { // If error is already displayed.
    return;
  }
  $(dataTags.nav).append(toastError);
  $(dataTags.errorClose).on('click', function(event) { // Event when 'X' button on error is clicked.
    event.preventDefault();
    $(dataTags.error).remove();
  });
};

const escape = (str) => { // Prevents cross-site scripting.
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
