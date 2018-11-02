/* global bootbox */
$(document).ready(function () {
    $(document).on("click", ".save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
  
    function handleArticleSave() {
      console.log("save article");
      var articleToSave = $(this).parents(".card").data();
      // Remove card from page
      $(this).parents(".card").remove();
      articleToSave.saved = true;
      
      $.ajax({
        method: "POST",
        url: "/api/savearticle",
        data: articleToSave
      }).then(function (data) {
      });
    }
  
    function handleArticleScrape() {
      $.ajax('/api/scrape', {
        async: false,
        type: 'GET'
      }).then(function (res) {
      });
    };
  
  });
  