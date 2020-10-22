
var randomImage = new Array(); 


randomImage[0] = "1";
randomImage[1] = "2"; 
randomImage[2] = "3"; 
randomImage[3] = "4"; 
randomImage[4] = "5"; 
randomImage[5] = "6"; 
randomImage[6] = "7"; 
randomImage[7] = "8"; 
randomImage[8] = "9"; 
randomImage[9] = "10"; 
randomImage[10] = "11"; 
randomImage[11] = "12"; 
randomImage[12] = "13"; 
randomImage[13] = "14"; 
randomImage[14] = "15"; 
randomImage[15] = "16"; 
randomImage[16] = "17"; 
randomImage[17] = "18"; 
randomImage[18] = "19"; 
randomImage[19] = "20"; 
randomImage[20] = "21"; 
randomImage[21] = "22"; 
randomImage[22] = "23"; 
randomImage[23] = "24"; 
randomImage[24] = "25"; 
randomImage[25] = "26"; 
randomImage[26] = "27"; 
randomImage[27] = "28"; 
randomImage[28] = "29"; 
randomImage[29] = "30"; 
randomImage[30] = "31"; 
randomImage[31] = "32"; 
randomImage[32] = "33"; 
randomImage[33] = "34"; 
randomImage[34] = "35"; 
randomImage[35] = "36"; 
randomImage[36] = "37"; 
randomImage[37] = "38"; 
randomImage[38] = "39"; 
randomImage[39] = "40"; 
randomImage[40] = "41"; 
randomImage[41] = "42"; 
randomImage[42] = "43"; 
randomImage[43] = "44"; 
randomImage[44] = "45"; 
randomImage[45] = "46"; 
randomImage[46] = "47"; 
randomImage[47] = "48"; 
randomImage[48] = "49"; 
randomImage[49] = "50"; 
randomImage[50] = "51"; 
randomImage[51] = "52"; 
randomImage[52] = "53"; 
randomImage[53] = "54"; 
randomImage[54] = "55"; 
randomImage[55] = "56"; 
randomImage[56] = "57"; 
randomImage[57] = "58"; 
randomImage[58] = "59"; 
randomImage[59] = "60"; 
randomImage[60] = "61"; 
randomImage[61] = "62"; 
randomImage[62] = "63"; 
randomImage[63] = "64"; 
randomImage[64] = "65"; 
randomImage[65] = "66"; 
randomImage[66] = "67"; 
randomImage[67] = "68"; 
randomImage[68] = "69"; 
randomImage[69] = "70"; 
randomImage[70] = "71"; 
randomImage[71] = "72"; 
randomImage[72] = "73"; 
randomImage[73] = "74"; 
randomImage[74] = "75"; 
randomImage[75] = "76"; 
randomImage[76] = "77"; 
randomImage[77] = "78"; 
randomImage[78] = "79"; 
randomImage[79] = "80"; 
randomImage[80] = "81"; 
randomImage[81] = "82"; 
randomImage[82] = "83"; 
randomImage[83] = "84"; 
randomImage[84] = "85"; 
randomImage[85] = "86"; 
randomImage[86] = "87"; 
randomImage[87] = "88"; 
randomImage[88] = "89"; 
randomImage[89] = "90"; 
randomImage[90] = "91"; 
randomImage[91] = "92"; 
randomImage[92] = "93"; 
randomImage[93] = "94"; 
randomImage[94] = "95"; 
randomImage[95] = "96"; 
randomImage[96] = "97"; 
randomImage[97] = "98"; 
randomImage[98] = "99"; 
randomImage[99] = "100";
randomImage[100] = "101"; 



function getRandomImage() { 
var number1 = Math.round(Math.random()*randomImage.length);
while(number1 == 34.0 || number1 == 40.0 || number1==36.0 || number1==37.0||number1==38.0)
{
	number1 = Math.round(Math.random()*randomImage.length);
}
	
	
var number2 = Math.round(Math.random()*randomImage.length);
while(number2==number1 || number2==31.0 || number2==32.0 || number2==34.0)
{
	number2 = Math.round(Math.random()*randomImage.length);
}

var number3 = Math.round(Math.random()*randomImage.length);
while(number3==number1 || number3==number2 || number3==33.0 || number3==32.0 || number3==31.0 || number3==36.0 || number3==37.0||number3==38.0||number3==69.0)
{
	number3 = Math.round(Math.random()*randomImage.length);
}


document.write('<img src=".\\comic_images_english\\img_'+randomImage[number1]+'.png" width="100px" height="100px">');
document.write('<img src=".\\comic_images_english\\img_'+randomImage[number2]+'.png" width="100px" height="100px">');
document.write('<img src=".\\comic_images_english\\img_'+randomImage[number3]+'.png" width="100px" height="100px">');


}
getRandomImage()
