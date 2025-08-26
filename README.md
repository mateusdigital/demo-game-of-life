# Game of Life

**Made with <3 by [mateus.digital](https://mateus.digital)**


<!-- ----------------------------------------------------------------------- -->
<p align="center">
  <a href="https://mateus.digital/game-of-life">
    <img style="border-radius: 10px;" src="https://raw.githubusercontent.com/mateusdigital/demo-game-of-life/refs/heads/main/_project-resources/readme.gif"/>
  </a>
</p>

<!-- Badges -->
[![Latest release](https://img.shields.io/github/v/tag/mateusdigital/demo-game-of-life?label=Latest%20release&style=for-the-badge)](https://github.com/mateusdigital/game-of-life/releases)
![GitHub package.json version](https://img.shields.io/github/package-json/v/mateusdigital/demo-game-of-life?style=for-the-badge)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/t/mateusdigital/demo-game-of-life?style=for-the-badge)](https://github.com/mateusdigital/game-of-life/commits)
[![Stars](https://img.shields.io/github/stars/mateusdigital/demo-game-of-life?style=for-the-badge)](https://github.com/mateusdigital/game-of-life/stargazers)
![GitHub License](https://img.shields.io/github/license/mateusdigital/demo-game-of-life?style=for-the-badge)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmateus.digital/game-of-life%2Findex.html&style=for-the-badge&logo=web)](https://mateus.digital/game-of-life)



<!-- ----------------------------------------------------------------------- -->
## Description:

**Game of Life** is an implementation of the classic <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Conway's Game of Life</a>.

You can check it [live here](https://mateus.digital/game-of-life).

As usual, you are **very welcomed** to **share** and **hack** it.

<!-- Share -->

[![Share](https://img.shields.io/badge/share-000000?logo=x&logoColor=white)](https://x.com/intent/tweet?text=Check%20out%20this%20project%20on%20GitHub:%20https://github.com/mateusdigital/game-of-life%20%23pixelart%20%23gamedev)
[![Share](https://img.shields.io/badge/share-1877F2?logo=facebook&logoColor=white)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/mateusdigital/game-of-life)
[![Share](https://img.shields.io/badge/share-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/mateusdigital/game-of-life)
[![Share](https://img.shields.io/badge/share-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/submit?title=Check%20out%20this%20project%20on%20GitHub:%20https://github.com/mateusdigital/game-of-life)
[![Share](https://img.shields.io/badge/share-0088CC?logo=telegram&logoColor=white)](https://t.me/share/url?url=https://github.com/mateusdigital/game-of-life&text=Check%20out%20this%20project%20on%20GitHub)
[![Star](https://img.shields.io/badge/⭐%20Give%20a%20Star-000000?logo=github&logoColor=white)](https://github.com/mateusdigital/game-of-life/stargazers)


<!-- ----------------------------------------------------------------------- -->
## Dependencies:
- [pwsh](https://github.com/PowerShell/PowerShell) - build scripts (optional)
- [nodejs](https://nodejs.org/en) - for development (optional)



<!-- ----------------------------------------------------------------------- -->
## Building:


```pwsh
git clone https://github.com/mateusdigital/demo-game-of-life
cd game-of-life
./build-clean.ps1             ##  Cleans temporary directories (_build, _dist, _out) to reset the project state.
./build-demo.ps1              ##  Builds the web demo, updates version info, and prepares files.
./build-project-web-page.ps1  ##  Copies the web release build to the ./_out directory for deployment.
./generate-release-zip.ps1    ##  Packages builds into versioned ZIP archives in ./_dist.
./deploy-project-web-page.ps1 ##  Deploys the web page to a remote server using rsync.

## All above are available as targets for npm run ...
```

<!-- ----------------------------------------------------------------------- -->
## Running:
Just open the ```index.html```


<!-- ----------------------------------------------------------------------- -->
## License:

This software is released under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).


<!-- ----------------------------------------------------------------------- -->
## Others:

- Email: hello@mateus.digital
- Website: https://mateus.digital
- Itch.io: https://mateusdigital.itch.io
- Linkedin: https://www.linkedin.com/in/mateusdigital
- Twitter: https://www.twitter.com/_mateusdigital
- Youtube: https://www.youtube.com/@_mateusdigital

There's more FLOSS things at [mateus.digital](https://mateus.digital) :)
