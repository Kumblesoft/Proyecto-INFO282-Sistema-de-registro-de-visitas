export const parseDateFormat = (format) => {
  const regex = /(dd|DD|mm|MM|aaaa|AAAA|yyyy|YYYY)/g
  const matches = format.match(regex)
  
  if (!matches) {
    throw new Error('Invalid date format')
  }

  return matches.map(match => {
    switch (match.toLowerCase()) {
      case 'dd': return 'day'
      case 'mm': return 'month'
      case 'aaaa':
      case 'yyyy': return 'year'
      default: throw new Error('Invalid date format')
    }
  })
}

// Recibe un string de fecha y un formato que sea cualquier combinacion dd,mm,aaaa o yyyy separado por - o /.
// Retorna un objeto Date decodificado.
export const decodeDate = (dateString, format) => {
    const dateOrder = parseDateFormat(format)
    const dateParts = dateString.split(/[-/]/)
  
    if (dateParts.length !== 3) 
      throw new Error('Invalid date string')
    
  
    const dateObject = {}
    dateOrder.forEach((part, index) => {
      dateObject[part] = parseInt(dateParts[index], 10)
    })
  
    const { day, month, year } = dateObject
  
    // Ajustar el mes ya que en JavaScript los meses van de 0 a 11
    return new Date(year, month - 1, day)
}