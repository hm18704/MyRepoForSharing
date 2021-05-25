//to run the scipt: console --> node routes/importdata.js routes/importFile/Book2.xlsx
const xlsx =require('xlsx');
const filePath=process.argv.slice(2)[0];
console.log(filePath);
const workbook=xlsx.readFile(filePath);
//console.log(workbook);
const worksheet=workbook.Sheets[workbook.SheetNames[0]];

const posts=[];
let post={};

for (let cell in worksheet){
    const cellAsString=cell.toString();

    if(cellAsString[1]!=='r' 
    && cellAsString !=='m' && cellAsString[1]>1) {
        if(cellAsString[0]==='A'){
            post.title=worksheet[cell].v;
        }
        if(cellAsString[0]==='B'){
            post.author=worksheet[cell].v;
        }
        if(cellAsString[0]==='C'){
            post.released=worksheet[cell].v;
            posts.push(post);
            post={};
        }
    }
}

console.log(posts);