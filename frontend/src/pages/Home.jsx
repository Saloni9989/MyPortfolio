import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Projects from '../components/sections/Projects'
import Experience from '../components/sections/Experience'
import Achievements from '../components/sections/Achievements'
import Certificates from '../components/sections/Certificates'
import CodingProfiles from '../components/sections/CodingProfiles'
import Resume from '../components/sections/Resume'
import Contact from '../components/sections/Contact'
import Footer from '../components/layout/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Achievements />
      <Certificates />
      <CodingProfiles />
      <Resume />
      <Contact />
      <Footer />
    </main>
  )
}
