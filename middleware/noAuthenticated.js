export default function({ redirect }) {
    // If the user is authenticated redirect to home page

    let id_usuario = localStorage.getItem("user_id");
    console.log('Midll' + id_usuario)
    if (id_usuario != null) {
        return redirect('/home')
    }
}