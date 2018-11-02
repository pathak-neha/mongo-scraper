/* global bootbox */
$(document).ready(function () {

    $('.addNote').on('click', function (e) {
      $('#noteArea').empty();
      $('#noteBodyEntry').val('');
      let id = $(this).data('id');
      console.log("id: " + id);
      $('#submitNote, #noteBodyEntry').attr('data-id', id);
      $.ajax({
        url: '/api/notes/' + id,
        type: 'GET',
        success: function (data) {
          console.log(JSON.stringify(data));
          $.each(data.notes, function (i, item) {
            console.log("item: " + item);
            showNote(item, id);
          });
          $('#noteModal').modal('show');
        }
      });
    });
  
  
    function showNote(element, articleId) {
      let $title = $('<p>')
        .text(element.body)
        .addClass('noteTitle');
      let $deleteButton = $('<button>')
        .text('X')
        .addClass('deleteNote');
      let $note = $('<div>')
        .append($deleteButton, $title)
        .attr('data-note-id', element._id)
        .attr('data-article-id', articleId)
        .addClass('note')
        .appendTo('#noteArea');
    }
  
    $('#submitNote').on('click', function (e) {
      e.preventDefault();
      sendNote($(this));
    });
  
    function sendNote(element) {
      let note = {};
      note.articleId = $(element).attr('data-id'),
        note.body = $('#noteBodyEntry').val().trim();
      if (note.body) {
        $.ajax({
          url: '/api/createNote',
          type: 'POST',
          data: note,
          success: function (response) {
            showNote(response, note.articleId);
            $('#noteBodyEntry').val('');
          }
        });
      }
    }
  
    $(document).on('click', '.deleteNote', function (e) {
      e.stopPropagation();
      let thisItem = $(this);
      let ids = {
        noteId: $(this).parent().data('note-id'),
        articleId: $(this).parent().data('id')
      };
      $.ajax({
        url: '/api/deleteNote',
        type: 'POST',
        data: ids,
        success: function (response) {
          thisItem.parent().remove();
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    });
  
    $(document).on('click', '.deleteNote', function (e) {
      e.stopPropagation();
      let thisItem = $(this);
      let ids = {
        noteId: $(this).parent().data('note-id'),
        articleId: $(this).parent().data('id')
      };
      $.ajax({
        url: '/api/deleteNote',
        type: 'POST',
        data: ids,
        success: function (response) {
          thisItem.parent().remove();
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    });
  
  
    $(document).on('click', '.deleteArticle', function (e) {
      e.stopPropagation();
      var articleToDelete = $(this).parents(".card").data();
      console.log("articleToDelete: " + articleToDelete);
      // Remove card from page
      $(this).parents(".card").remove();
      articleToDelete.saved = false;
      $.ajax({
        url: '/api/deleteArticle',
        type: 'POST',
        data: articleToDelete
      }).then(function (data) {
      });
    });
  
  });
  
  
  