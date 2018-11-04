// -
function expand() {
    $(".search").toggleClass("close");
    $(".input").toggleClass("square");
    if ($('.search').hasClass('close')) {
        $('input').focus();
    } else {
        $('input').blur();
    }
}
$('button').on('click', expand);

$(document).ready(function(){
    $('.dropdown-submenu a.test').on("click", function(e){
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
});

