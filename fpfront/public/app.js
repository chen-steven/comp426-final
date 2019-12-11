const cafeList = document.querySelector('#cafe-list');

//create elements and render cafe
function renderRecyclables(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');

    li.setAttribute('data-id',doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;

    li.appendChild(name);
    li.appendChild(city);

    cafeList.appendChild(li);
}

db.collection('recyclables').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderRecyclables(doc)
    })
})