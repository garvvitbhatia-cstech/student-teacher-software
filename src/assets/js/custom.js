/*===================================================
custom javascript for My Caregiver
===================================================*/
$(function(){

	$('[data-toggle="tooltip"]').tooltip();

	$(window).scroll(function() {
		if ($(this).scrollTop()) {
			$('#back-top').fadeIn();
		} else {
			$('#back-top').fadeOut();
		}
	});

	$("#back-top").click(function () {
	   //1 second of animation time
	   //html works for FFX but not Chrome
	   //body works for Chrome but not FFX
	   //This strange selector seems to work universally
	   $("html, body").animate({scrollTop: 0}, 1500);
	});

	//sidebar hover
	$('#nav-accordion a').mouseover(function(){
		$(this).parent('li').prev('li').addClass('NextHover');
	}).mouseout(function(){
		if($(this).parent('li').hasClass('active')){
			return false;
		}else{
			$(this).parent('li').prev('li').removeClass('NextHover');
		}
	});
	$('#nav-accordion li.active').prev('li').addClass('NextHover');


	if($(window).width() > 1199){
        
	}

	$('.sidebar-toggle-box').click(function () {
		$('.navbar-toggle').toggleClass('closeMenu');
		$('.sidebar').toggleClass('openMenu');
		// $('.page-wrapper').toggleClass('MenuOpened');
    });
});
