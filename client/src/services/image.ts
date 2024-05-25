class ImageHelper {
  public static async ConvertBase64(file: File) {
    if (!file) return undefined
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  public static GetUrl(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files.length > 0) {
      return window.URL.createObjectURL(e.target.files[0])
    }
    return ''
  }
}

export default ImageHelper
