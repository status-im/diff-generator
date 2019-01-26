const genBuild = (idx) => ({
  commit: `COMMIT-${Math.floor(idx/4)}`,
  name: `status-react/nightly/${Math.floor(idx/4)}`,
  type: 'android',
  url: `URL-${idx}`
})

const genBuilds = (count) => {
  return Array.apply(null, Array(count)).map((v,i)=>genBuild(i+1))
}

const BUILD = genBuild(1)

module.exports = { BUILD, genBuild, genBuilds }
