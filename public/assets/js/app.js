$(document).ready(function() {

  function scrapeNews() {
      $.ajax({
          method: "GET",
          url: "/scrape"
      }).then(function (data) {
          setTimeout(location.replace("/scraped-results"), 2000);
      });
  }

  function saveArticle(idObj) {
      $.ajax("/save-article", {
          type: "PUT",
          data: idObj
      }).then(function (data) {
          setTimeout(location.replace("/updated-scraped-results"), 1500);
      });
  };

  function deleteArticle(idObj) {
      $.ajax("/delete-article", {
          type: "DELETE",
          data: idObj
      }).then(function (data) {
          setTimeout(location.reload(), 1500);
      });
  };

  $("#scrapeBtn").on("click", function(event) {
      event.preventDefault();
      scrapeNews();
  });

  $(".saveBtns").on("click", function (event) {
      event.preventDefault();
      var idObj = {
          id: $(this).val()
      }
      saveArticle(idObj);
  });

  $(".delBtns").on("click", function (event) {
      event.preventDefault();
      var idObj = {
          id: $(this).val()
      }
      deleteArticle(idObj);
  });

  $(".noteBtns").on("click", function (event) {
      event.preventDefault();
      $(".existingNotesContainer").empty();
      $("#saveMsg").hide();
      var articleID = $(this).val();
      $("#noteModal").attr("data-id", articleID);
      
      $.ajax({
          method: "GET",
          url: "/articles/" + articleID
      }).then(function (data) {
          $(".existingNotesContainer").append("<div id='existingNoteInput' name='body' contenteditable='true'></div>");
          $(".existingNotesContainer").append("<button data-id='" + data._id + "' class='saveNoteBtns btn btn-primary'>Save</button>");

          if (data.note) {
              $("#existingNoteInput").append(data.note.body);
          }
      })
  });

  $(document).on("click", ".saveNoteBtns", function (event) {
      event.preventDefault();
      var articleID = $(this).attr("data-id");
      $.ajax({
          method: "POST",
          url: "/articles/" + articleID,
          data: {
              id: articleID,
              body: $("#existingNoteInput").text()
          }
      })
          .then(function (data) {
              $("#saveMsg").show();
          });

  });

});