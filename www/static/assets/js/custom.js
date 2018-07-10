/* ------------------------------------------------------------------------------
 *
 *  # Custom JS code
 *
 *  Place here all your custom js. Make sure it's loaded after app.js
 *
 * ---------------------------------------------------------------------------- */

// <div id="modal_remote" class="modal fade" tabindex="-1">
//   <div class="modal-dialog modal-lg">
//   <div class="modal-content">
//   <div class="modal-header">
//   <h5 class="modal-title">Remote source</h5>
// <button type="button" class="close" data-dismiss="modal">&times;</button>
// </div>
//
// <div class="modal-body"></div>
//
// {#<div class="modal-footer">#}
// {#<button type="button" class="btn btn-link" data-dismiss="modal">Close</button>#}
//   {#<button type="button" class="btn bg-primary">Save changes</button>#}
//     {#</div>#}
//     </div>
//     </div>
//     </div>

// ajax modal
function _ajaxmodal () {
  $(document).on('click', '[data-toggle="ajaxModal"]',
    function (e) {
      $('#ajaxModal').remove();
      e.preventDefault();
      var $this = $(this),
        $remote = $this.data('remote') || $this.attr('href'),

        $modal = $('<div class="modal fade" id="ajaxModal" tabindex="-1"><div class="modal-body"></div></div>');
      $('body').append($modal);
      $modal.modal();
      $modal.load($remote);
    }
  );
}
/* Init */
jQuery(window).ready(function () {
  // jQuery.browserDetect();
  _ajaxmodal()
  // Load Bootstrap JS
  // loadScript(plugin_path + 'bootstrap/js/bootstrap.min.js', function () {
  //   Init(false);
  // });

  /* --- */
  // if (jQuery('html').hasClass('chrome') && jQuery('body').hasClass('smoothscroll')) {
  //   loadScript(plugin_path + 'smoothscroll.js', function () {
  //     jQuery.smoothScroll();
  //   });
  // }
  /* --- */
});
// function Init() {}