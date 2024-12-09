// src/utils/objectAdder.ts
export function addObjects(obj1: Record<string, number>, 
                            obj2: Record<string, number>): Record<string, number> {
    const result: Record<string, number> = {};
  
    // Merge the keys of both objects
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  
    keys.forEach((key) => {
      result[key] = (obj1[key] || 0) + (obj2[key] || 0);
    });
  
    return result;
  }  
console.log("Terros Project runs")