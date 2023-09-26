const puppeteer = require("puppeteer")
const fs = require("fs")

const LoadOnlyPage = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })

  // Open a new page
  const page = await browser.newPage()

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  })
}

const GetSpecificElement = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })

  // Open a new page
  const page = await browser.newPage()

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  })

  // Get page data
  const quotes = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    const quote = document.querySelector(".quote")

    // Fetch the sub-elements from the previously fetched quote element
    // Get the displayed text and return it (`.innerText`)
    const text = quote.querySelector(".text").innerText
    const author = quote.querySelector(".author").innerText

    return { text, author }
  })

  // Display the quotes
  console.log(quotes)

  // Close the browser
  await browser.close()
}

const GetAllElementWithSameName = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will be in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })

  // Open a new page
  const page = await browser.newPage()

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  })

  // Get page data
  const quotes = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    // Get the displayed text and returns it
    const quoteList = document.querySelectorAll(".quote")

    // Convert the quoteList to an iterable array
    // For each quote fetch the text and author
    return Array.from(quoteList).map((quote) => {
      // Fetch the sub-elements from the previously fetched quote element
      // Get the displayed text and return it (`.innerText`)
      const text = quote.querySelector(".text").innerText
      const author = quote.querySelector(".author").innerText
      const tags = quote.querySelector(".tags").innerText

      return { text, author, tags }
    })
  })

  // Display the quotes
  console.log(quotes)

  // Close the browser
  await browser.close()
}

const GetManyPagesAndManyElements = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    })

    // open new tab
    const page = await browser.newPage()

    // open the first page
    await page.goto("http://quotes.toscrape.com/", {
      waitUntil: "domcontentloaded",
    })

    for (let index = 1; index <= 2; index++) {
      // Get page data
      const quotes = await page.evaluate(() => {
        // Fetch the first element with class "quote"
        // Get the displayed text and returns it
        const quoteList = document.querySelectorAll(".quote")

        // Convert the quoteList to an iterable array
        // For each quote fetch the text and author
        return Array.from(quoteList).map((quote) => {
          // Fetch the sub-elements from the previously fetched quote element
          // Get the displayed text and return it (`.innerText`)
          const text = quote.querySelector(".text").innerText
          const author = quote.querySelector(".author").innerText
          const tags = quote.querySelector(".tags").innerText

          return { text, author, tags }
        })
      })

      // Display the quotes
      console.log(`Loaded on page ${index}`, quotes)

      // Click on the "Next" button
      await page.click(".pager .next a")
    }

    // Close the browser
    await browser.close()
  } catch (error) {
    console.log(error)
  }
}

// get one car from dasty2 website
const getOneCar = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })
  try {
    const page = await browser.newPage()

    // open the first page
    await page.goto("https://dasy2.com/main?id=1", {
      waitUntil: "domcontentloaded",
    })
    const car = await page.evaluate(async () => {
      const car = document.querySelector(".mainitem")

      const carModel = car.querySelector(".mainitemmdodel").innerText

      const carDetail = car.querySelector(".mainitemtitle")

      const carName = carDetail.querySelector("h1").innerText
      const carPrice = carDetail.querySelector("span").innerText

      //   get image url
      let carImage = document.querySelector(".mainitemimg img")
      carImage = carImage
        ? "https://dasy2.com/" + carImage?.getAttribute("src")
        : "Image src not found"

      return { carModel, carName, carPrice, carImage }
    })

    console.log(car)

    await browser.close()
  } catch (error) {
    console.log("error", error)
    await browser.close()
  }
}

const getAllOnePageCars = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })
  try {
    const page = await browser.newPage()

    // open the first page
    await page.goto("https://dasy2.com/main?id=1", {
      waitUntil: "domcontentloaded",
    })
    const car = await page.evaluate(async () => {
      const carList = document.querySelectorAll(".mainitem")

      return Array.from(carList).map((car) => {
        const carModel = car.querySelector(".mainitemmdodel").innerText
        const carDetail = car.querySelector(".mainitemtitle")
        const carName = carDetail.querySelector("h1").innerText
        const carPrice = carDetail.querySelector("span").innerText
        //   get image url
        let carImage = document.querySelector(".mainitemimg img")
        carImage = carImage
          ? "https://dasy2.com/" + carImage?.getAttribute("src")
          : "Image src not found"

        return { carModel, carName, carPrice, carImage }
      })
    })

    console.log(car)

    await browser.close()
  } catch (error) {
    console.log("error", error)
    await browser.close()
  }
}

const getAllOnePageCarsWithPagination = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })

  try {
    const page = await browser.newPage()

    // open the first page
    await page.goto("https://dasy2.com/main?id=1", {
      waitUntil: "domcontentloaded",
    })

    for (let index = 1; index <= 10; index++) {
      const car = await page.evaluate(async () => {
        const carList = document.querySelectorAll(".mainitem")

        return Array.from(carList).map((car) => {
          const carModel = car.querySelector(".mainitemmdodel").innerText
          const carDetail = car.querySelector(".mainitemtitle")
          const carName = carDetail.querySelector("h1").innerText
          const carPrice = carDetail.querySelector("span").innerText
          // get image url
          let carImage = document.querySelector(".mainitemimg img")
          carImage = carImage
            ? "https://dasy2.com/" + carImage?.getAttribute("src")
            : "Image src not found"

          return { carModel, carName, carPrice, carImage }
        })
      })

      await page.evaluate(() => {
        const datapager1 = document.querySelector("#MianContent_datapager1")
        if (datapager1) {
          const links = datapager1.querySelectorAll("a")
          if (links.length > 1) {
            // Click the last link (which should be the "Next" link)
            links[links.length - 1].click()
          } else if (links.length === 1) {
            // If there's only one link, click it
            links[0].click()
          }
        }
      })

      await page.waitForNavigation({ waitUntil: "domcontentloaded" })

      await fs.writeFile(
        `./data/page_${index}.json`,
        JSON.stringify(car),
        function (err) {
          if (err) throw err
        }
      )

      // log the result
    }
    console.log("Saved!")

    await browser.close()
  } catch (error) {
    console.log("error", error)
    await browser.close()
  }
}

getAllOnePageCarsWithPagination()

getAllOnePageCarsWithPagination()
