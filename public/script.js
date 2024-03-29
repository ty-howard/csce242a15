const getCrafts = async() => {
    try {
        return (await fetch("/api/crafts/")).json();
    } catch(error){
        console.log("error retrieving data");
    }
};
  
  const showCrafts = async() => {
    const crafts = await getCrafts();
    const craftsDiv = document.getElementById("gallery");
    craftsDiv.innerHTML = "";

    crafts.forEach((craft)=>{
        const section = document.createElement("section");
        section.classList.add("craft");
        craftsDiv.append(section);

        const figure = document.createElement("figure");
        section.append(figure);

        const img = document.createElement("img");
        img.src = "images/" + craft.img;
        figure.append(img);

        figure.onclick = (e) => {
            e.preventDefault();
            displayDetails(craft);
        };
    });
  };

  const displayDetails = (craft) => {
    openDialog("craft-details");

    const craftDetails = document.getElementById("craft-details");
    craftDetails.classList.add("columns");
    craftDetails.innerHTML = "";

    const picSec = document.createElement("section");
    picSec.classList.add("one");
    craftDetails.append(picSec);

    const pic = document.createElement("img");
    pic.src = "./images/" + craft.img;
    picSec.append(pic);

    const txtSec = document.createElement("section");
    txtSec.classList.add("two");
    craftDetails.append(txtSec);

    const h3 = document.createElement("h3");
    h3.innerHTML = craft.name;
    txtSec.append(h3);

    const p = document.createElement("p");
    p.innerHTML = craft.description;
    txtSec.append(p);

    const h4 = document.createElement("h4");
    h4.innerHTML = "Supplies:";
    txtSec.append(h4);

    const ul = document.createElement("ul");
    txtSec.append(ul);

    craft.supplies.forEach((supply)=> {
        const li = document.createElement("li");
        li.innerHTML = supply;
        ul.append(li);
    });
  };

const openDialog = (id) => {
    document.getElementById("dialog").style.display = "block";
    document.querySelectorAll("#dialog-details > *").forEach((item)=> {
        item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

const showCraftForm = (e) => {
    e.preventDefault();
    resetForm();
    openDialog("add-craft-form");
}

const addSupply = (e) => {
    e.preventDefault();
    const section = document.getElementById("supply-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

const resetForm = () => {
    const form = document.getElementById("add-craft-form");
    form.reset();
    document.getElementById("supply-boxes").innerHTML = "";
    document.getElementById("img-prev").src="";
};

const addCraft = async(e)=> {
    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
    formData.append("supplies", getSupplies());
    console.log(...formData);

    const response = await fetch("/api/crafts", {
        method:"POST",
        body:formData
    });

    if(response.status != 200){
        console.log("error posting data");
    }

    await response.json();
    resetForm();
    document.getElementById("dialog").style.display = "none";
    showCrafts();

};

const getSupplies = () => {
    const inputs = document.querySelectorAll("#supply-boxes input");
    const supplies = [];

    inputs.forEach((input)=>{
        supplies.push(input.value);
    });

    return supplies;
}

//on Load

showCrafts();
document.getElementById("add-craft-form").onsubmit = addCraft;
document.getElementById("add-link").onclick = showCraftForm;
document.getElementById("add-supply").onclick = addSupply;

document.getElementById("img").onchange = (e) => {
    const prev = document.getElementById("img-prev");

    //they didn't pick an image
    if(!e.target.files.length){
        prev.src = "";
        return;
    }

    prev.src = URL.createObjectURL(e.target.files.item(0));
}