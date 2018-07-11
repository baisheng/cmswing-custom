/* eslint-disable no-undef */
/* ------------------------------------------------------------------------------
 *
 *  # Custom JS code
 *
 *  Place here all your custom js. Make sure it's loaded after app.js
 *
 * ---------------------------------------------------------------------------- */


// Setup module
// ------------------------------

var Notify = function() {

  //
  // Return objects assigned to module
  //

  return {
    close: function () {
      PNotify.closeAll()
    },
    init: function() {
      // _componentPnotify();
    },
    error: function (text, title) {
      return PNotify.alert({
        // title: title || '错误提示',
        text: text || '操作失败',
        // icon: icon || 'icon-blocked',
        addClass: 'bg-danger border-danger',
        type: 'error'
      })
    },
    warning: function (text) {
      return PNotify.alert({
        // title: title || '信息提示',
        text: text || '警告提示',
        // icon: icon || 'icon-info22',
        addClass: 'bg-warning border-warning',
        type: 'warning'
      })
    },
    success: function (text, title, icon) {
      return PNotify.alert({
        // title: title || '提示',
        text: text || '操作成功',
        addClass: 'bg-success border-success',
        type: 'success'
      })
    },
    info: function (text) {
      return PNotify.alert({
        // title: title || '信息提示',
        text: text || '信息提示',
        // icon: icon || 'icon-info22',
        addClass: 'bg-primary border-primary',
        type: 'info'
      })
    }
  }
}();

function _ajax_get () {
  $(document).on('click', '.ajax-get', function () {
    var target;
    var that = this;
    if ($(this).hasClass('confirm')) {
      if (!confirm('确认要执行该操作吗?')) {
        return false;
      }
    }
    if ((target = $(this).attr('href')) || (target = $(this).attr('url'))) {
      $.get(target).done(function (data) {
        if (data.errno == 0) {
          if (data.data.url) {
           Notify.success(data.data.name + '(页面即将自动跳转)')
          } else {
            Notify.success(data.data.name)
          }
          setTimeout(function () {
            if (data.data.url) {
              location.href = data.data.url;
            } else {
              location.reload();
            }
          }, 1500);
        } else {
          Notify.error(data.errmsg)
          setTimeout(function () {
            if (data.data) {
              location.href = data.data;
            } else {
              Notify.clear()
            }
          }, 1500);
        }
      });
    }
    return false;
  });
}
function _ajax_post () {
  $(document).on('click', '.ajax-post', function () {
    var target, query, form;
    var target_form = $(this).attr('target-form');
    var that = this;
    var nead_confirm = false;
    if (($(this).attr('type') == 'submit') || (target = $(this).attr('href')) || (target = $(this).attr('url'))) {
      form = $('.' + target_form);
      if ($(this).attr('hide-data') === 'true') { // 无数据时也可以使用的功能
        form = $('.hide-data');
        query = form.serialize();
      } else if (form.get(0) == undefined) {
        return false;
      } else if (form.get(0).nodeName == 'FORM') {
        // 表单验证
        // $('[data-validate="parsley"]').parsley().validate();
        // if(true !== $('[data-validate="parsley"]').parsley().isValid()){
        //     return false;
        // }
        if ($(this).hasClass('confirm')) {
          if (!confirm('确认要执行该操作吗?')) {
            return false;
          }
        }
        if ($(this).attr('url') !== undefined) {
          target = $(this).attr('url');
        } else {
          target = form.get(0).action;
        }
        query = form.serialize();
      } else if (form.get(0).nodeName == 'INPUT' || form.get(0).nodeName == 'SELECT' || form.get(0).nodeName == 'TEXTAREA') {
        form.each(function (k, v) {
          if (v.type == 'checkbox' && v.checked == true) {
            nead_confirm = true;
          }
        });
        if (nead_confirm && $(this).hasClass('confirm')) {
          if (!confirm('确认要执行该操作吗?')) {
            return false;
          }
        }
        query = form.serialize();
      } else {
        if ($(this).hasClass('confirm')) {
          if (!confirm('确认要执行该操作吗?')) {
            return false;
          }
        }
        query = form.find('input,select,textarea').serialize();
      }
      $(that).addClass('disabled').attr('autocomplete', 'off').prop('disabled', true);
      $.post(target, query).done(function (data) {
        if (data.errno == 0) {
          if (data.data.url) {
            Notify.success(data.data.name + ' (页面即将自动跳转)')
          } else {
            Notify.success(data.data.name)
          }
          setTimeout(function () {
            $(that).removeClass('disabled').prop('disabled', false);
            if (data.data.url) {
              location.href = data.data.url;
            } else if ($(that).hasClass('no-refresh')) {
              Notify.close()
            } else {
              location.reload();
            }
          }, 1500);
        } else {
          if (data.errno == 1001) {
            $.each(data.errmsg, function (i, n) {
              Notify.error(n)
            });
          } else {
            Notify.error(data.errmsg)
          }

          setTimeout(function () {
            $(that).removeClass('disabled').prop('disabled', false);
            if (data.data) {
              location.href = data.data;
            } else {
              Notify.close()
            }
          }, 1500);
        }
      });
    }
    return false;
  });
}

// Initialize module
// ------------------------------

document.addEventListener('DOMContentLoaded', function() {
//   Notify.init();
  _ajax_get();
  _ajax_post();
});

