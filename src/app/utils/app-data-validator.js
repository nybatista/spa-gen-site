const R = require('ramda');

const requiredAppPropsArr  = ['text', 'content'];
const requiredPagePropsArr = ['pageId',  'background', 'headline', 'text', 'linkDataset'];
const requiredCardPropsArr = ['topicId', 'background', 'headline', 'text', 'linkDataset'];

const pageHasContent = R.compose(R.includes('content'), R.keys)



// MAP OBJECTS TO CHECK THAT THE ABOVE PROPERTIES EXISTS FOR ALL OBJECTS AND RETURNS TRUE / FALSE
const mapRequiredProps = arr => obj => {
  const keysArr = R.keys(obj);
  const mapKeyExists = k=>R.includes(k, keysArr);
  return R.compose(R.all(R.equals(true)), R.map(mapKeyExists))(arr)
}

const appPropsCheckFn = mapRequiredProps(requiredAppPropsArr);
const pagePropsCheckFn = mapRequiredProps(requiredPagePropsArr);
const cardPropsCheckFn = mapRequiredProps(requiredCardPropsArr);
const mapAllCards = R.compose(R.all(R.equals(true)), R.map(cardPropsCheckFn), R.prop('content'))

// ================================================================


const validateAppGenContent = (content)=>{
  const mapPageAndCardsContentIsValid = (pageObj)=>{
    const pageIsValid = pagePropsCheckFn(pageObj);
    //console.log('\npage is valid ',{pageIsValid, pageObj},'\n')
    return pageHasContent(pageObj) ? pageIsValid && mapAllCards(pageObj) : pageIsValid;
  }
  return R.compose(R.all(R.equals(true)), R.map(mapPageAndCardsContentIsValid))(content);
}


const validateAppGenData = (data) => {
  const appDataPropsAreValid = appPropsCheckFn(data);
  const content = R.compose(R.defaultTo([]), R.prop('content',))(data);
  return appDataPropsAreValid && validateAppGenContent(content);

}



module.exports = {validateAppGenData, validateAppGenContent,appPropsCheckFn,pagePropsCheckFn, cardPropsCheckFn}
