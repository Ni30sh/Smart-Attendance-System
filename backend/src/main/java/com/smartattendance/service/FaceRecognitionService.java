package com.smartattendance.service;

import com.smartattendance.dto.FaceRecognitionRequest;
import com.smartattendance.dto.FaceRecognitionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.time.Duration;

@Service
public class FaceRecognitionService {
    
    private final WebClient webClient;
    
    @Value("${face.recognition.service.url}")
    private String faceRecognitionServiceUrl;
    
    public FaceRecognitionService(WebClient webClient) {
        this.webClient = webClient;
    }
    
    public Mono<FaceRecognitionResponse> recognizeFaces(String imageData) {
        FaceRecognitionRequest request = new FaceRecognitionRequest(imageData);
        
        return webClient.post()
                .uri(faceRecognitionServiceUrl + "/recognize")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(FaceRecognitionResponse.class)
                .timeout(Duration.ofSeconds(30))
                .onErrorReturn(new FaceRecognitionResponse(null, false, "Face recognition service unavailable"));
    }
}