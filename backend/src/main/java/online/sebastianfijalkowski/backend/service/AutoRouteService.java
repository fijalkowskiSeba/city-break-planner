package online.sebastianfijalkowski.backend.service;

import online.sebastianfijalkowski.backend.dto.TripPointDTO;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AutoRouteService {

    public List<TripPointDTO> optimizeTrip(List<TripPointDTO> tripPoints, TripPointDTO startPoint, TripPointDTO endPoint) {
        tripPoints.remove(startPoint);
        tripPoints.remove(endPoint);

        if (startPoint == null && endPoint == null) {
            return optimizedTripNoStartNoEnd(tripPoints);
        } else if (startPoint == null) {
            return optimizedTripNoStart(tripPoints, endPoint);
        } else if (endPoint == null) {
            return optimizedTripNoEnd(tripPoints, startPoint);
        }

        List<TripPointDTO> optimizedTrip = optimizedTripNoEnd(tripPoints, startPoint);

        endPoint.setOrderInTrip(optimizedTrip.size());
        optimizedTrip.add(endPoint);

        return optimizedTrip;
    }

    private List<TripPointDTO> optimizedTripNoEnd(List<TripPointDTO> originalList, TripPointDTO startPoint) {
        List<TripPointDTO> tripPoints = new ArrayList<>(originalList);
        List<TripPointDTO> optimizedTrip = new ArrayList<>();

        startPoint.setOrderInTrip(0);

        optimizedTrip.add(startPoint);

        int order = 1;
        while (!tripPoints.isEmpty()) {
            TripPointDTO lastPoint = optimizedTrip.get(optimizedTrip.size() - 1);

            Collections.sort(tripPoints, Comparator.comparingDouble(point ->
                    calculateDistance(point.getLatitude(), point.getLongitude(),
                            lastPoint.getLatitude(), lastPoint.getLongitude())));

            tripPoints.get(0).setOrderInTrip(order++);

            optimizedTrip.add(tripPoints.get(0));

            tripPoints.remove(0);
        }

        for (int i = 0; i < optimizedTrip.size(); i++) {
            optimizedTrip.get(i).setOrderInTrip(i);
        }

        return optimizedTrip;
    }


    private List<TripPointDTO> optimizedTripNoStart(List<TripPointDTO> tripPoints, TripPointDTO endPoint) {
        List<TripPointDTO> reversedTrip = optimizedTripNoEnd(new ArrayList<>(tripPoints), endPoint);

        Collections.reverse(reversedTrip);

        for (int i = 0; i < reversedTrip.size(); i++) {
            reversedTrip.get(i).setOrderInTrip(i);
        }

        return reversedTrip;
    }

    private List<TripPointDTO> optimizedTripNoStartNoEnd(List<TripPointDTO> tripPoints) {
        if (tripPoints == null || tripPoints.isEmpty() || tripPoints.size() == 1) {
            return tripPoints;
        }

        List<TripPointDTO> optimizedTrip = new ArrayList<>();

        TripPointDTO firstPoint = findFurthestPoint(tripPoints);
        tripPoints.remove(firstPoint);

        if (firstPoint == null) {
            return optimizedTrip;
        }

        return optimizedTripNoEnd(tripPoints, firstPoint);
    }

    private TripPointDTO findFurthestPoint(List<TripPointDTO> tripPoints) {
        if (tripPoints == null || tripPoints.isEmpty()) {
            return null;
        }

        TripPointDTO randomPoint = tripPoints.get(new Random().nextInt(tripPoints.size()));
        double maxDistance = 0;
        TripPointDTO furthestPoint = null;

        for (TripPointDTO point : tripPoints) {
            double distance = calculateDistance(randomPoint.getLatitude(), randomPoint.getLongitude(),
                    point.getLatitude(), point.getLongitude());

            if (distance > maxDistance) {
                maxDistance = distance;
                furthestPoint = point;
            }
        }

        return furthestPoint;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        lat1 = Math.toRadians(lat1);
        lon1 = Math.toRadians(lon1);
        lat2 = Math.toRadians(lat2);
        lon2 = Math.toRadians(lon2);

        double dLat = lat2 - lat1;
        double dLon = lon2 - lon1;

        return Math.sqrt(dLat * dLat + dLon * dLon);
    }

}
