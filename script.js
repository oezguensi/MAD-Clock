const generateClockData = (width, digits, ratio) => {
  const radius = width / (4 * digits.length + (2 * digits.length - 1) * ratio)
  const gapWidth = ratio * radius
  return digits.map((_, i) => {
    return (
      [
        [{ cx: i * (4 * radius + 2 * gapWidth) + radius, cy: radius, r: radius }],
        [{ cx: i * (4 * radius + 2 * gapWidth) + 3 * radius + gapWidth, cy: radius, r: radius }],
        [{ cx: i * (4 * radius + 2 * gapWidth) + 3 * radius + gapWidth, cy: 3 * radius + gapWidth, r: radius }],
        [{ cx: i * (4 * radius + 2 * gapWidth) + 3 * radius + gapWidth, cy: 5 * radius + 2 * gapWidth, r: radius }],
        [{ cx: i * (4 * radius + 2 * gapWidth) + radius, cy: 5 * radius + 2 * gapWidth, r: radius }],
        [{ cx: i * (4 * radius + 2 * gapWidth) + radius, cy: 3 * radius + gapWidth, r: radius }],
      ]
    )
  })
}

const getHandFigures = (digit) => {
  const handFigures = [
    { hour: 3, minute: 30 },
    { hour: 9, minute: 30 },
    { hour: 0, minute: 15 },
    { hour: 0, minute: 30 },
    { hour: 0, minute: 45 },
    { hour: 6, minute: 30 },
    { hour: 0, minute: 0 },
    { hour: 3, minute: 15 },
    { hour: 9, minute: 45 },
    { hour: 7, minute: 35 }
  ]
  switch (digit) {
    case 0:
      return [handFigures[0], handFigures[1], handFigures[3], handFigures[4], handFigures[2], handFigures[3]]
    case 1:
      return [handFigures[9], handFigures[5], handFigures[3], handFigures[6], handFigures[9], handFigures[9]]
    case 2:
      return [handFigures[7], handFigures[1], handFigures[4], handFigures[8], handFigures[2], handFigures[0]]
    case 3:
      return [handFigures[7], handFigures[1], handFigures[4], handFigures[4], handFigures[7], handFigures[7]]
    case 4:
      return [handFigures[5], handFigures[5], handFigures[3], handFigures[6], handFigures[9], handFigures[2]]
    case 5:
      return [handFigures[0], handFigures[8], handFigures[1], handFigures[4], handFigures[7], handFigures[2]]
    case 6:
      return [handFigures[0], handFigures[8], handFigures[1], handFigures[4], handFigures[2], handFigures[3]]
    case 7:
      return [handFigures[7], handFigures[1], handFigures[3], handFigures[6], handFigures[9], handFigures[9]]
    case 8:
      return [handFigures[0], handFigures[1], handFigures[4], handFigures[4], handFigures[2], handFigures[0]]
    case 9:
      return [handFigures[0], handFigures[1], handFigures[3], handFigures[4], handFigures[7], handFigures[2]]
    default:
      break;
  }
}

const generateHandData = (digits) => {
  return digits.map(digit => getHandFigures(digit))
}

const getTimeDigits = () => {
  const now = new Date()
  let hours = now.getHours() + 23
  let minutes = now.getMinutes()
  let seconds = now.getSeconds()
  hours = hours < 10 ? [0, hours] : [(hours - hours % 10) / 10, hours % 10]
  minutes = minutes < 10 ? [0, minutes] : [(minutes - minutes % 10) / 10, minutes % 10]
  seconds = seconds < 10 ? [0, seconds] : [(seconds - seconds % 10) / 10, seconds % 10]
  return hours.concat(minutes).concat(seconds)
}

const width = 900,
  height = 560,
  ratio = 1 / 10,
  digits = getTimeDigits(),
  radius = width / (4 * digits.length + (2 * digits.length - 1) * ratio),
  groupHeight = (6 + 2 * ratio) * radius

let handData = generateHandData(digits)

const groups = d3.select("svg").selectAll(".group")
  .data(generateClockData(width, digits, ratio))
  .enter()
  .append("g")
  .attr("class", "group")
  .attr("transform", `translate(0,${(height - groupHeight) / 2})`)

const clocks = groups.selectAll(".clock")
  .data(d => d)
  .enter()
  .append("g")
  .attr("class", "clock")
  .attr('transform', d => 'translate(' + d[0].cx + ',' + d[0].cy + ')')

clocks.selectAll("circle")
  .data(d => d)
  .enter()
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", d => d.r)
  .attr("fill", "#232930")

const hourScale = d3.scaleLinear().domain([0, 11]).range([0, 330])
const minuteScale = d3.scaleLinear().domain([0, 59]).range([0, 354])

groups
  .selectAll(".clock")
  .selectAll(".hourHand")
  .data(d => d)
  .enter()
  .append("line")
  .attr("class", "hourHand")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", 0)
  .attr("y2", - radius * 0.8)
  .style("stroke", "#e8e6e3")
  .style("stroke-width", radius / 5)
  .style("stroke-linecap", "round")

groups
  .selectAll(".clock")
  .selectAll(".minuteHand")
  .data(d => d)
  .enter()
  .append("line")
  .attr("class", "minuteHand")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", 0)
  .attr("y2", - radius * 0.8)
  .style("stroke", "#e8e6e3")
  .style("stroke-width", radius / 5)
  .style("stroke-linecap", "round")

const moveHands = () => {
  groups
    .data(handData)
    .selectAll(".hourHand")
    .data(d => d)
    .transition()
    .ease(d3.easeSin)
    .duration(900)
    .attrTween("transform", function (d) {
      let oldValue = d3.select(this).attr("transform")
      oldValue = oldValue === null ? 0 : parseFloat(oldValue.substr(7, oldValue.length - 1))
      const i = d3.interpolate(oldValue, hourScale(d.hour))
      return (t) => `rotate(${i(t)})`
    })

  groups
    .data(handData)
    .selectAll(".minuteHand")
    .data(d => d)
    .transition()
    .ease(d3.easeSin)
    .duration(900)
    .attrTween("transform", function (d) {
      let oldValue = d3.select(this).attr("transform")
      oldValue = oldValue === null ? 0 : parseFloat(oldValue.substr(7, oldValue.length - 1))
      const i = d3.interpolate(oldValue, minuteScale(d.minute))
      return (t) => `rotate(${i(t)})`
    })
}

moveHands()

const updateData = () => {
  handData = generateHandData(getTimeDigits())
}

d3.interval(function () {
  updateData()
  moveHands()
}, 1000)
