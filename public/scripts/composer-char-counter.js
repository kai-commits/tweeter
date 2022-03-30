$(document).ready(function() {
  console.log('Im ready!');

  $(dataTags.input).on('input', function() {
    const updatedCount = MAX_TWITTER_CHAR_COUNT - this.value.length;
    $(dataTags.counter).val(updatedCount);

    if ($(dataTags.counter).val() < 0) {
      $(dataTags.counter).attr('class', 'counter-negative');
    } else {
      $(dataTags.counter).attr('class', 'counter');
    }
  });
});
