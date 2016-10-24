$(document).ready(function(){
    //disbaling some functions for Internet Explorer
    if($.browser.msie)
    {
        //$('#is-ajax').prop('checked',false);
        //$('#for-is-ajax').hide();
        $('#toggle-fullscreen').hide();
        $('.login-box').find('.input-large').removeClass('span10');
    }
    //highlight current / active link
    $('ul.main-menu li a').each(function(){
            if($($(this))[0].href==String(window.location))
                    $(this).parent().addClass('active');
    });
    //establish history variables
    var
            History = window.History, // Note: We are using a capital H instead of a lower h
            State = History.getState(),
            $log = $('#log');
    //bind to State Change
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
            var State = History.getState(); // Note: We are using History.getState() instead of event.state
            $.ajax({
                    url:State.url,
                    success:function(msg){
                            $('#content').html($(msg).find('#content').html());
                            $('#loading').remove();
                            $('#content').fadeIn();
                            docReady();
                    }
            });
    });
    //ajaxify menus
    /*
    $('a.ajax-link').click(function(e){
            if($.browser.msie) e.which=1;
            if(e.which!=1 || !$('#is-ajax').prop('checked') || $(this).parent().hasClass('active')) return;
            e.preventDefault();
            if($('.btn-navbar').is(':visible'))
            {
                    $('.btn-navbar').click();
            }
            $('#loading').remove();
            $('#content').fadeOut().parent().append('<div id="loading" class="center">Loading...<div class="center"></div></div>');
            var $clink=$(this);
            History.pushState(null, null, $clink.attr('href'));
            $('ul.main-menu li.active').removeClass('active');
            $clink.parent('li').addClass('active');	
    });
    */
   $("#sms_msg").charCount({
        allowed: 459,
        warning: 420,
        counterText: 'SMS characters left: '
    });
    //other things to do on document ready, seperated for ajax calls
    docReady();
});
		
		
function docReady(){
    //prevent # links from moving to top
    $('a[href="#"][data-top!=true]').click(function(e){
            e.preventDefault();
    });
    $('#togglechkbox').change(function() {
        var boxtoggle = $('#togglechkbox').prop('checked');
        var pocchkbox = $('.pocchkbox');
        pocchkbox.prop("checked", boxtoggle);
        //uniform styler - need to set class on parent
        if (boxtoggle) {
            pocchkbox.parent().addClass('checked');
        } else {
            pocchkbox.parent().removeClass('checked');
        }        
    });
    $('.pocchkbox').change(function() {
        var boxtoggle = $(this).prop('checked'); //clicked checkbox
        var controlbox = $('#togglechkbox'); //master chkbox
        if (!boxtoggle) {
            //unchecking so turn off master
            controlbox.prop("checked", false);
            controlbox.parent().removeClass('checked');
            controlbox.val('9');
        }
        //global state check
        if ($('.pocchkbox:not(:checked)').length == 0) {
            //all checked so check master toggle
            controlbox.prop("checked", true);
            controlbox.parent().addClass('checked');
            controlbox.val('1');
        }
    });
    $('#togglechkbox').prop({
        checked: true
    });
    $('.pocchkbox').prop({
        checked: true
    });
    $('#qbuildbtn').click(function(e){
        var poc = $.trim($('#qbuildin').val());
        var query = $.trim($('#qbuildout').val());
        if (poc != '') {
            //poc = '"'+poc+'"';
            if (query == '') {
                $('#qbuildout').val(poc);
            } else {
                $('#qbuildout').val(query+' OR '+poc);
            }
            $('#qbuildin').val(''); //clear
        }
    });
    $('#qbuildclearbtn').click(function(e){
        $('#qbuildout').val(''); //clear
        $('#qbuildin').val(''); //clear
    });
    $('#qbuilddonebtn').click(function(e){
        var query = $('#qbuildout').val();
        if (query != '') {
            $('#pocname').val(query);
        }
        $('#tab1anchor').click(); //show 'filter' tab
    });
    //uniform - styler for checkbox, radio and file input
    $("input:checkbox, input:radio, input:file").not('[data-no-uniform="true"],#uniform-is-ajax').uniform();
    //chosen - improves select
    $('[data-rel="chosen"],[rel="chosen"]').chosen();
    //auto grow textarea
    $('textarea.autogrow').autogrow();
    //iOS / iPhone style toggle switch
    $('.iphone-toggle').iphoneStyle();
    
    //datepicker - see eyecon.ro/bootstrap-datepicker
    //$('.dpicker').datepicker({format:'dd/mm/yyyy',weekStart:1});
    //using in-built jquery datepicker - see api.jqueryui.com/datepicker
    $('.dpicker').datepicker({dateFormat: 'dd/mm/yy'});
}
