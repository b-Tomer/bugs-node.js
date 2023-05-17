import { showSuccessMsg } from '../services/event-bus.service.js'
const { useEffect } = React

export function AppFooter () {

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <footer className='app-footer'>
              <h4>©️CoffeRights Tomer Benaim</h4>
            <section className="social-btns">
            <a href="https://www.facebook.com/tomer.benaim/"><i className="fa-brands fa-square-facebook"></i></a>
            <a href="https://www.instagram.com/tomer_benaim/"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://twitter.com/"><i className="fa-brands fa-twitter"></i></a>
            </section>
        </footer>
    )

}