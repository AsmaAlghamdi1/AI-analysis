let menuIcon=document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
let sections = document.querySelectorAll("section");
let navLink = document.querySelectorAll("header nav a");
// document.getElementById('start').addEventListener('click',()=>{
//     document.getElementById('blurBg').style.display='flex'
// });
// document.getElementById('close-btn').addEventListener('click',()=>{
//     document.getElementById('blurBg').style.display='none'
// });

window.onscroll = () => {
    sections.forEach(sec =>{
        let top= window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute("id");

        if(top >= offset && top < offset + height){
            navLink.forEach(links =>{
                links.classList.remove("active");
                document.querySelector("header nav a [href*="+id+"]").classList.add
                ("active")
            })
        }
    })
}

menuIcon.onclick = () =>{
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
}

document.getElementById('start').addEventListener('click',()=>{
    document.getElementById('blurBg').style.display='flex'
});
document.getElementById('close-btn').addEventListener('click',()=>{
    document.getElementById('blurBg').style.display='none'
});

//Send data from frontend to backend 
document.getElementsByClassName('contact-form')[0].addEventListener('submit',async (e)=>{
     e.preventDefault();     
    let fullname = document.getElementById('full-name').value.trim();
    let email = document.getElementById('email').value.trim();
    let subject = document.getElementById('subject').value.trim();
    let message = document.getElementById('message').value.trim();
    
   await fetch("https://ai-analysis-4n6p.onrender.com/contact", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ fullname, email, subject, message })
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ Success:", data);
        alert("✅ تمت الإرسال بنجاح");
    })
    .catch(err => {
        console.error("❌ Error:", err);
        alert("❌ حدث خطأ أثناء الإرسال");
    });
});
