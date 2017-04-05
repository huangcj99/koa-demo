/**
 * Created by gunjoe on 2017/2/7.
 */

if (!localStorage.commodity_num) {
    localStorage.commodity_num = 0;
}

$(".main_header .nav_right li:first-child").html(localStorage.commodity_num);