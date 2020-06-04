// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from 'react';
// import axios from 'axios'

// import '../styles/filters.css';
// import { DEFAULT_PAGE } from '../utils/requestConst';
// import { SEARCH_SERVER_PATH } from '../utils/externalPath';
// import Button from './ui/Button/Button';


// const SearchFilters = ({ getParams }) => {
//   // const [inputDisabled, setInputDisabled] = useState(false);
//   // const [type, setType] = useState('')
//   // const [breed, setBreed] = useState('')
//   // const [distFeatures, setDistFeatures] = useState('')
//   // const [city, setCity] = useState('')
//   // const [search, setSearch] = useState({})

//   useEffect(() => {
//     const searchParams = {
//       current_page: DEFAULT_PAGE,
//       items_on_page: 500,
//     };
//     let searchFields = {}
//       const url = `${SEARCH_SERVER_PATH}/`;
//       const request = axios({
//         method: 'get',
//         url,
//         data: null,
//         headers: {
//           'X-Authorization': localStorage.getItem('X-Authorization'),
//         },
//         params: searchParams,
//       });

//       request
//         .then((response) => {
//           localStorage.removeItem('X-Authorization')
//             const newToken = response.headers['x-authorization']
//             localStorage.setItem('X-Authorization', newToken)
//             return response.data
//   })
//         .then((data) => {
//           data.content.map((it) => {
//             if (!Object.keys(searchFields).includes(it.type)) {
//               searchFields = { ...searchFields, [it.type]: [`${it.breed}`] }
//             } else {
//               let arrBreeds = [...searchFields[it.type]]
//               if (!arrBreeds.includes(it.breed)) {
//                 arrBreeds = [...arrBreeds, it.breed]
//               }
//               searchFields = { ...searchFields, [it.type]: arrBreeds }
//             }
//             return searchFields
//           })
//           return searchFields
//         })
//         .then((obj) => {
//           localStorage.removeItem('searchFields')
//           localStorage.setItem('searchFields', JSON.stringify(obj))
// })
//         .catch((error) => {
//           const { status, message, error: err } = error.response.data;
//           // this.setState({
//           //   isModalOpen: true,
//           //   errorMessage: message,
//           //   errorType: `${status}: ${err}`,
//           //   loading: false,
//           // });
//           console.log(status, err, message)
//         });
//   }, [])


//   // const updateSeerch = (value, fieldtype) => {
//   //   if (value === null) {
//   //     setSearch({})
//   //   } else if (fieldtype === 'type') {
//   //     setBreed('')
//   //     setSearch({ [fieldtype]: value })
//   //   } else { setSearch({ ...search, [fieldtype]: value }) }
//   // }

//   // const selectHandler = (value, fieldtype) => {
//   //   if (fieldtype === 'breed') {
//   //     setBreed(value)
//   //   }
//   //   if (fieldtype === 'type') {
//   //     setType(value)
//   //   }
//   //   updateSeerch(value, fieldtype)
//   // }


//   // const searchHandler = (value, fieldtype) => {
//   //   setSearch({ ...search, [fieldtype]: value })
//   // };

//   // const inputChangeHandler = (e) => {
//   //   if (e.target.name === 'distFeatures') {
//   //     setDistFeatures(e.target.value)
//   //   }
//   //   if (e.target.name === 'city') {
//   //     setCity(e.target.value)
//   //   }
//   // }

//   // const resetHandler = () => {
//   //   setType('')
//   //   setBreed('')
//   //   setDistFeatures('')
//   //   setCity('')
//   //   updateSeerch(null, null)
//   // }

//   // useEffect(() => {
//   //   getParams(search)
//   // }, [search])

//   return (

//     <h1>filter</h1>

//   //   <div className="filterform-wrapper">
//   //     <div className="field-wrapper">
//   //       <select
//   //         id="type"
//   //         name="type"
//   //         value={type}
//   //         onChange={(e) => selectHandler(e.target.value, e.target.name)}
//   //         className="filter-select-field"
//   //       >
//   //         <option value="">Pet&apos;s type</option>
//   //         {
//   //         Object.keys(JSON.parse(localStorage.getItem('searchFields')))
//   //         .map((it) => <option value={it} key={it}>{it}</option>)
//   //       }
//   //       </select>
//   //     </div>
//   //     <div className="field-wrapper">
//   //       <select
//   //         id="breed"
//   //         name="breed"
//   //         value={breed}
//   //         onChange={(e) => selectHandler(e.target.value, e.target.name)}
//   //         className="filter-select-field"
//   //       >
//   //         <option value="">Pet&apos;s breed</option>
//   //         {
//   //         type !== '' && JSON.parse(localStorage.getItem('searchFields'))[type].map((it) => <option value={it} key={it}>{it}</option>)
//   //       }
//   //       </select>
//   //     </div>
//   //     <div className="field-wrapper-lg">
//   //       <input
//   //         type="text"
//   //         name="distFeatures"
//   //         placeholder="Additional features"
//   //         className="filter-input"
//   //         value={distFeatures}
//   //         onChange={inputChangeHandler}
//   //         onBlur={(event) => {
//   //         event.preventDefault();
//   //         searchHandler(event.target.value, event.target.name);
//   //       }}
//   //         onKeyPress={(event) => {
//   //         if (event.keyCode === 13 || event.which === 13) {
//   //           searchHandler(event.target.value, event.target.name);
//   //         }
//   //       }}
//   //       />
//   //     </div>

//   //     <div className="field-wrapper">
//   //       <input
//   //         type="text"
//   //         name="city"
//   //         disabled
//   //         placeholder="Location"
//   //         className="filter-input"
//   //         value={city}
//   //         onChange={inputChangeHandler}
//   //         onBlur={(event) => {
//   //         event.preventDefault();
//   //         searchHandler(event.target.value, event.target.name);
//   //       }}
//   //         onKeyPress={(event) => {
//   //         if (event.keyCode === 13 || event.which === 13) {
//   //           searchHandler(event.target.value, event.target.name);
//   //         }
//   //       }}
//   //       />
//   //     </div>

//   //     {(search.type !== undefined || search.distFeatures !== undefined || search.city !== undefined)
//   //     && <Button onClick={resetHandler}>Reset search</Button>}
//   //   </div>
//   );
// };

// export default SearchFilters;
