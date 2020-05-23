const cheerio = require("cheerio");
const axios = require("axios").default;
const fs = require('fs');

var data_row;
countinueScarping=true
function resetData(){
data_row = ['no data', 'no data', 'no data', 'no data', 'no data', 'no data', 'no data', 'no data', 'no data', 'no data',
  'false', 'false', 'no data', 'no data', 'no data', 'no data', 'no data'];
}

const fethHtml = async url => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    console.error(
      `ERROR: An error occurred while trying to fetch the URL: ${url}`
    );
  }
};

const getApartmentLinksOnPage = async (page) => {
  const steamUrl =
    `https://www.realitica.com/?cur_page=${page.toString()}&for=Najam&pZpa=Crna+Gora&pState=Crna+Gora&type%5B%5D=&lng=hr`;

  const html = await fethHtml(steamUrl);

  const $ = cheerio.load(html);
  lastPageClass = $("body").find(".bt_pages_ghost span").toArray().map((x) => { return $(x).text() });
  console.log(lastPageClass)
  if(lastPageClass[0] && lastPageClass[0].includes(">>")){
  console.log("stopping")
  countinueScarping=false
  }

  const searchResults = $("#left_column_holder").find(".thumb_div a").toArray().map((x) => { return $(x).attr("href") });

  return searchResults

};

function nodeValue(val){
  return val[0].nextSibling.nodeValue
}

function filed_process(strong_tag) {
  switch (strong_tag.text()) {
    case 'Vrsta':
      data_row[0] = nodeValue(strong_tag)
      break;
    case 'Područje':
      data_row[1] = nodeValue(strong_tag)
      break;
    case 'Lokacija':
      data_row[2] = nodeValue(strong_tag)
      break;
    case 'Adresa':
      data_row[3] = nodeValue(strong_tag)
      break;
    case 'Cijena':
      data_row[4] = nodeValue(strong_tag)
      break;
    case 'Godina Gradnje':
      data_row[5] = nodeValue(strong_tag)
      break;
    case 'Spavaćih Soba':
      data_row[6] = nodeValue(strong_tag)
      break;
    case 'Kupatila':
      data_row[7] = nodeValue(strong_tag)
      break;
    case 'Stambena Površina':
      data_row[8] = nodeValue(strong_tag)
      break;
    case 'Parking Mjesta':
      data_row[9] = nodeValue(strong_tag)
      break;
    case 'Novogradnja':
      data_row[10] = "true"
      break;
    case 'Klima Uređaj':
      data_row[11] = "true"
      break;
    case 'Opis':
      data_row[12] = nodeValue(strong_tag)
      break;
    case 'Oglasio':
      data_row[13] = strong_tag.next("a").text()
      break;
    case 'Mobitel':
      data_row[14] = nodeValue(strong_tag)
      break;
    case 'Oglas Broj':
      data_row[15] = nodeValue(strong_tag)
      break;
    case 'Zadnja Promjena':
      data_row[16] = nodeValue(strong_tag)
      break;
  }
}

async function scrapingOneApartment(link) {
  data_row[17] = link;

  const html = await fethHtml(link);

  const $ = cheerio.load(html);

  $("#listing_body").find("strong").toArray().map((x, i) => {
    //console.log($(x).text(), i , $(x)[0].nextSibling.nodeValue)
    filed_process($(x))
  });
}

async function wirte() {
  data_row = data_row.map(
    (s) => {
      if(s[0]==":")
      s=s.slice(2)
      return s.replace(/\n|,|\t/g, "")
  });
  console.log(data_row)
  fs.appendFileSync('Accommodation.csv', ` \n${data_row}`);
}


async function main() {
  page=0;
  while(countinueScarping){
  apr_links = await getApartmentLinksOnPage(page)
  for(let i=0; i < apr_links.length ; i++){
  resetData()
  await scrapingOneApartment(apr_links[i])
  wirte()
  }
  page = page+1;
}
}

main()
async function test(){
  const a = await getApartmentLinksOnPage(62)
  console.log(a)
}
