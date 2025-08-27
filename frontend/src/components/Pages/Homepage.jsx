// import React, { useEffect, useState } from "react";
// import Filter from "../components/Filter";
// import LocationCard from "../components/LocationCard";
// import useFetch from "../hooks/useFetch";

// const Homepage = (props) => {
//   const [filter, setFilter] = useState("");
//   const [isError, setIsError] = useState(false);
//   const [error, setError] = useState(null);
//   const fetchData = useFetch();
//   // const [props.allLocations, props.setAllLocations] = useState([]);
//   const [locations, setLocations] = useState([]);

//   const getAllLocations = async () => {
//     setIsError(false);
//     setError(null);

//     const res = await fetchData("/api/locations/", "GET");

//     if (res.ok) {
//       props.setAllLocations(res.data);
//     } else {
//       setError(res.message);
//       setIsError(true);
//     }
//   };

//   const filterLocations = () => {
//     // IF USER CLICKED ON LOGO, RESET FILTER
//     if (props.resetFilter) {
//       props.setResetFilter(false);
//       setFilter("");
//     }

//     if (filter) {
//       const filteredLocations = props.allLocations.filter(
//         (location) => location.region === filter
//       );
//       setLocations(filteredLocations);
//     } else {
//       setLocations(props.allLocations);
//     }
//   };

//   // NEED DOUBLE useEffect HERE DUE TO HOW getAllLocations IS ASYNC, MEANING THE filterLocations() WILL RUN FIRST
//   // MAKES IT SO THAT WHEN getAllLocations() IS DONE RUNNING AND SETSTATE FOR props.allLocations, IT calls filterLocations()
//   useEffect(() => {
//     filterLocations();
//   }, [props.allLocations]);

//   // MAKES IT SO THAT WHEN FILTER IS APPLIED (filter STATE CHANGES), WILL CALL getAllLocations() AGAIN WHICH WILL THEN CAUSE A CHANGE IN props.allLocations AND HENCE TRIGGER THE ABOVE useEffect again
//   // SAME LOGIC FOR THE props.resetFilter (WHEN USER CLICKS ON LOGO AND resetFilter STATE CHANGES)
//   useEffect(() => {
//     getAllLocations();
//   }, [props.resetFilter, filter]);

//   return (
//     <div className="container">
//       <Filter setFilter={setFilter} />
//       <div>{filter}</div>

//       {isError && error}
//       {!isError && (
//         <div className="row">
//           {locations.map((location) => {
//             return (
//               <LocationCard
//                 key={location._id}
//                 locationId={location._id}
//                 name={location.name}
//                 address={location.address}
//                 region={location.region}
//                 capacity={location.capacity}
//                 imageURI={location.image}
//               />
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Homepage;
